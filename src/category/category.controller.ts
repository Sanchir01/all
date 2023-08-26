import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Auth } from 'src/decorators/auth.decorator'
import { CategoryService } from './category.service'
import { CategoryDto } from './dto/category.dto'
import { createCategoryDto } from './dto/createCategory.dto'

@Controller('category')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Get(':slug')
	async getBySlug(@Param('slug') slug: string) {
		return this.categoryService.bySlug(slug)
	}

	@Get()
	async getAll() {
		return this.categoryService.getAll()
	}

	
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth('admin')
	@Put(':id')
	async update(
		@Param('categoryId') categoryId: string,
		@Body() dto: CategoryDto
	) {
		return this.categoryService.update(+categoryId, dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth('admin')
	@Post()
	async create(@Body() dto:createCategoryDto) {
		return this.categoryService.create(dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth('admin')
	@Delete(':id')
	async delete(@Param('categoryId') categoryId: string) {
		return this.categoryService.delete(+categoryId)
	}


	@Get(':id')
	@Auth()
	async getById(@Param('id') id: string) {
		
		return this.categoryService.byId(+id)
	}
}
