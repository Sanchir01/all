import { Prisma } from '@prisma/client'
import { ArrayMinSize, IsNumber, IsOptional, IsString } from 'class-validator'

export class ProductDto implements Prisma.ProductUpdateInput {
	@IsString()
	name: string

	@IsNumber()
	price: number

	@IsOptional()
	@IsOptional()
	description: string

	@IsString({ each: true })
	@ArrayMinSize(1)
	images: string[]


   @IsNumber()
   categoryId: number;
}
