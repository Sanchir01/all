import { Prisma } from '@prisma/client'
import { returnCategoryObject } from 'src/category/return-category.obj'
import { returnReviewObject } from 'src/rewiev/return-review.object'

export const productReturnObject: Prisma.ProductSelect = {
	images: true,
	id: true,
	name: true,
	price: true,
	slug: true,
	createdAt: true,
	description: true
}

export const productReturnObjectFullest: Prisma.ProductSelect = {
	...productReturnObject,
	reviews: { select: returnReviewObject },
	category: { select: returnCategoryObject }
}
