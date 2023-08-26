import { Prisma } from '@prisma/client'
import { ArrayMinSize, IsNumber, IsString } from 'class-validator'

export class CreateProductDto implements Prisma.ProductUpdateInput {
	@IsString()
	name: string

	@IsString()
	description: string

   @IsNumber()
   price: number 

   @IsString()
   categorySlug: string

   @IsString({ each: true })
   @ArrayMinSize(1)
   images: string[];
}
