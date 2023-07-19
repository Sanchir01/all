import { Prisma } from '@prisma/client'

export const returnCategoryObject: Prisma.CategorySelect = {
	id: true,
	slug: true,
	name: true
}
