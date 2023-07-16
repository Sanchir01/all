import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { hash } from 'argon2'
import { PrismaService } from 'src/prisma.service'
import { UserDto } from './dto/user.dto'
import { returnUserObject } from './return-user.object'

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}
	async byId(id: number, selectObject: Prisma.UserSelect = {}) {
		const user = await this.prisma.user.findUnique({
			where: { id },
			select: {
				...returnUserObject,
				favorites: {
					select: {
						id: true,
						name: true,
						images: true,
						slug: true,
						price: true
					}
				},
				...selectObject
			}
		})
		if (!user) {
			throw new Error(`User not found`)
		}
		
		return user
	}

	async updateProfile(id: number, dto: UserDto) {
		const isSameUser = await this.prisma.user.findUnique({
			where: { email: dto.email }
		})
		if (isSameUser && id !== isSameUser.id) {
			throw new BadRequestException('Email already in use')
		}
		const user = await this.byId(id)
		return this.prisma.user.update({
			where: { id },
			data: {
				email: dto.email,
				name: dto.name,
				avatarPath: dto.avatarPath,
				password: dto.password ? await hash(dto.password) : user.password
			}
		})
	}

	async toggleFavorites(productId: number, id: number) {
		const user = await this.byId(id)

		if (!user) throw new NotFoundException('user not found')

		const isExist = user.favorites.some(product => product.id === productId)

		await this.prisma.user.update({
			where: {
				id: user.id
			},
			data: {
				favorites: {
					[isExist ? 'disconnect' : 'connect']: { id: productId }
				}
			}
		})
		return "success"
	}
}
