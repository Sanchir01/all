import { faker } from '@faker-js/faker'
import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma.service'
import { EnumProductSort, GetAllProductsDto } from './dto/getAllProducts.dto'
import { ProductDto } from './dto/product.dto'
import { productReturnObjectFullest } from './return-product.object'

@Injectable()
export class ProductService {
	constructor(
		private prisma: PrismaService,
		private paginationService: PaginationService
	) {}

	async getAll(dto: GetAllProductsDto = {}) {
		const { sort, searchTerm } = dto

		const prismaSort: Prisma.ProductOrderByWithAggregationInput[] = []

		if (sort === EnumProductSort.LOW_PRICE) prismaSort.push({ price: 'asc' })
		else if (sort === EnumProductSort.HIGH_PRICE)
			prismaSort.push({ price: 'desc' })
		else if (sort === EnumProductSort.OLDEST)
			prismaSort.push({ createdAt: 'asc' })
		else prismaSort.push({ createdAt: 'desc' })

		const prismaSearchTermFilter: Prisma.ProductWhereInput = searchTerm
			? {
					OR: [
						{
							category: {
								name: {
									contains: searchTerm,
									mode: 'insensitive'
								}
							},
						
						},
                  {name: { contains: searchTerm, mode: 'insensitive' }},
                  {description: { contains: searchTerm, mode: 'insensitive' }}
					]
			  }
			: {}

		const { perPage, skip } = this.paginationService.getPagination(dto)

		const product = await this.prisma.product.findMany({
			where: prismaSearchTermFilter,
			orderBy: prismaSort,
			skip,
			take: perPage
		})

		return {
			product,
			length: await this.prisma.product.count({ where: prismaSearchTermFilter })
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

	async create() {
		const product = await this.prisma.product.create({
			data: {
				description: '',
				name: '',
				price: 0,
				slug: ''
			}
		})
		return product.id
	}

	async update(id: number, dto: ProductDto) {
		const { description, images, name, categoryId, price } = dto

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
}
