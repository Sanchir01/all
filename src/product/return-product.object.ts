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
	description: true,
	category: { select: returnCategoryObject },
	reviews: { select: returnReviewObject, orderBy: { createdAt: 'desc' } }
}

export const productReturnObjectFullest: Prisma.ProductSelect = {
	...productReturnObject
}
