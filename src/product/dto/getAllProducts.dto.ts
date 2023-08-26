import { IsEnum, IsOptional, IsString } from 'class-validator'
import { PaginationDto } from 'src/pagination/dto/paginatiom.dto'

export enum EnumProductSort {
	HIGH_PRICE = 'hight-price',
	LOW_PRICE = 'low-price',
	NEWEST = 'newest',
	OLDEST = 'oldest'
}

export class GetAllProductsDto extends PaginationDto {
	@IsOptional()
	@IsEnum(EnumProductSort)
	sort?: EnumProductSort

	@IsString()
	@IsOptional()
	searchTerm?: string

	@IsOptional()
	@IsString()
	ratings?: string

	@IsOptional()
	@IsString()
	minPrice?: string

	@IsOptional()
	@IsString()
	maxPrice?: string

	@IsOptional()
	@IsString()
	categoryId?: string
}
