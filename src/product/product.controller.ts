import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Auth } from 'src/decorators/auth.decorator'
import { GetAllProductsDto } from './dto/getAllProducts.dto'
import { ProductDto } from './dto/product.dto'
import { ProductService } from './product.service'

@Controller('products')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@UsePipes(new ValidationPipe())
	@Get()
	async getAll(@Query() queryDto: GetAllProductsDto) {
		
		return this.productService.getAll(queryDto)
	}

	@Get('similar/:id')
	async getSimilar(@Param('id') id: string) {
		
		return this.productService.getSimilar(+id)
	}

	@Get('by-slug/:slug')
	async getProductBySlug(@Param('slug') slug: string) {
		return this.productService.bySlug(slug)
	}

	@Get('by-category/:categorySlug')
	async getProductByCategory(@Param('categorySlug') categorySlug: string) {
		
		
		return this.productService.byCategory(categorySlug) 
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Post()
	async createProduct() {
		return this.productService.create()
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id')
	async updateProduct(@Param('id') id: string, @Body() dto: ProductDto) {
		return this.productService.update(+id, dto)
	}

	@HttpCode(200)
	@Delete(':id')
	@Auth()
	async deleteProduct(@Param('id') id: string) {
		return this.productService.delete(+id)
	}

	@Get(':id')
	@Auth()
	async getProduct(@Param('id') id: string) {
		return this.productService.byId(+id)
	}
}
