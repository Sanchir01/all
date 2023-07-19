import { faker } from '@faker-js/faker'
import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CategoryDto } from './dto/category.dto'
import { returnCategoryObject } from './return-category.obj'

@Injectable()
export class CategoryService {
	constructor(private prisma: PrismaService) {}

	async byId(id: number) {
		const category = await this.prisma.category.findUnique({
			where: { id },
			select: returnCategoryObject
		})
		if (!category) {
			throw new BadRequestException(`Category not found`)
		}
		return category
	}

	async bySlug(slug: string) {
		const category = await this.prisma.category.findUnique({
			where: { slug },
			select: returnCategoryObject
		})
		if (!category) {
			throw new BadRequestException(`Category not found`)
		}
		return category
	}

	async getAll() {
		return this.prisma.category.findMany({
			select: returnCategoryObject
		})
	}

	async update(id: number, dto: CategoryDto) {
		const category = await this.byId(id)
		return this.prisma.category.update({
			where: { id },
			data: {
				name: dto.name,
				slug: faker.helpers.slugify(dto.name)
			}
		})
		return category
	}

	async delete(id: number) {
		return this.prisma.category.delete({
			where: { id }
		})
	}

	async create() {
		return this.prisma.category.create({
			data: {
				name: '',
				slug: ''
			}
		})
	}
}
