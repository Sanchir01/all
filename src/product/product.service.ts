import { faker } from '@faker-js/faker'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { CategoryService } from 'src/category/category.service'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma.service'
import { convertToNumber } from 'utils/convert-to-number'
import { CreateProductDto } from './dto/createProduct.dto'
import { EnumProductSort, GetAllProductsDto } from './dto/getAllProducts.dto'
import { ProductDto } from './dto/product.dto'
import {
	productReturnObject,
	productReturnObjectFullest
} from './return-product.object'

@Injectable()
export class ProductService {
	constructor(
		private prisma: PrismaService,
		private paginationService: PaginationService,
		private categoryService: CategoryService
	) {}

	async getAll(dto: GetAllProductsDto = {}) {
		const filters = this.createFilters(dto)

		const { perPage, skip } = this.paginationService.getPagination(dto)

		const products = await this.prisma.product.findMany({
			where: filters,
			orderBy: this.getSortOption(dto.sort),
			skip,
			take: perPage,
			select: productReturnObject
		})

		return {
			products,
			length: await this.prisma.product.count({ where: filters })
		}
	}

	async byId(id: number) {
		const product = await this.prisma.product.findUnique({
			where: { id },
			select: productReturnObjectFullest
		})
		if (!product) throw new NotFoundException('Product not found')

		return product
	}

	async bySlug(slug: string) {
		const product = await this.prisma.product.findUnique({
			where: { slug },
			select: productReturnObjectFullest
		})
		if (!product) throw new NotFoundException('Product not found')

		return product
	}

	async byCategory(categorySlug: string) {
		const product = await this.prisma.product.findMany({
			where: { category: { slug: categorySlug } },
			select: productReturnObjectFullest
		})
		if (!product) throw new NotFoundException('Product not found')

		return product
	}

	async getSimilar(id: number) {
		const currentProduct = await this.byId(id)

		if (!currentProduct)
			throw new NotFoundException('Current product not found')
		const product = await this.prisma.product.findMany({
			where: {
				category: { name: currentProduct.category.name },
				NOT: { id: currentProduct.id }
			},
			orderBy: {
				createdAt: 'desc'
			},
			select: productReturnObjectFullest
		})

		return product
	}

	async create(dto: CreateProductDto) {
		
		const isExistByCategory = await this.prisma.category.findUnique({
			where:{slug:dto.categorySlug}
		})
		if(!isExistByCategory) throw new NotFoundException('нету такой категории')
		
		const isExistBySlug = await this.prisma.product.findUnique({
			where:{name:dto.name}
		})
		if(isExistBySlug) throw new BadRequestException('такой товар уже есть')

		const product = await this.prisma.product.create({
			data: {
				description: dto.description,
				name: dto.name,
				price: dto.price,
				slug: faker.helpers.slugify(dto.name).toLowerCase(),
				images: dto.images,
				category: {
					connect: {
						slug: dto.categorySlug
					}
				}
			}
		})
		return product
	}

	async update(id: number, dto: ProductDto) {
		const { description, images, name, categoryId, price } = dto

		await this.categoryService.byId(categoryId)

		return this.prisma.product.update({
			where: { id },
			data: {
				description,
				images,
				name,
				price,
				slug: faker.helpers.slugify(name).toLowerCase(),
				category: { connect: { id: categoryId } }
			}
		})
	}

	async delete(id: number) {
		return this.prisma.product.delete({ where: { id } })
	}

	private getCategoryFilter(categoryId: number): Prisma.ProductWhereInput {
		return {
			categoryId
		}
	}
	private getPriceFilter(
		minPrice?: number,
		maxPrice?: number
	): Prisma.ProductWhereInput {
		let priceFilter: Prisma.IntFilter | undefined = undefined
		if (minPrice) {
			priceFilter = {
				...priceFilter,
				gte: minPrice
			}
		}

		if (maxPrice) {
			priceFilter = {
				...priceFilter,
				lte: maxPrice
			}
		}

		return {
			price: priceFilter
		}
	}

	private getRatingFilter(ratings: number[]): Prisma.ProductWhereInput {
		return {
			reviews: {
				some: {
					rating: {
						in: ratings
					}
				}
			}
		}
	}

	private getSearchTermFilter(searchTerm: string): Prisma.ProductWhereInput {
		return {
			OR: [
				{
					category: {
						name: {
							contains: searchTerm,
							mode: 'insensitive'
						}
					}
				},
				{ name: { contains: searchTerm, mode: 'insensitive' } },
				{ description: { contains: searchTerm, mode: 'insensitive' } }
			]
		}
	}

	private getSortOption(
		sort: EnumProductSort
	): Prisma.ProductOrderByWithRelationInput[] {
		switch (sort) {
			case EnumProductSort.LOW_PRICE:
				return [{ price: 'asc' }]
			case EnumProductSort.HIGH_PRICE:
				return [{ price: 'desc' }]
			case EnumProductSort.NEWEST:
				return [{ price: 'asc' }]
			case EnumProductSort.OLDEST:
				return [{ price: 'desc' }]
		}
	}

	private createFilters(dto: GetAllProductsDto): Prisma.ProductWhereInput {
		const filters: Prisma.ProductWhereInput[] = []
		if (dto.searchTerm) filters.push(this.getSearchTermFilter(dto.searchTerm))

		if (dto.ratings)
			filters.push(
				this.getRatingFilter(dto.ratings.split('|').map(rating => +rating))
			)

		if (dto.minPrice || dto.maxPrice)
			filters.push(
				this.getPriceFilter(
					convertToNumber(dto.minPrice),
					convertToNumber(dto.maxPrice)
				)
			)

		if (dto.categoryId) filters.push(this.getCategoryFilter(+dto.categoryId))

		return filters.length ? { AND: filters } : {}
	}
}
