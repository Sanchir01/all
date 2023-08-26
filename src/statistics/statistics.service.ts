/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { UserService } from 'src/user/user.service'

@Injectable()
export class StatisticsService {
	constructor(
		private prisma: PrismaService,
		private UserService: UserService
	) {}

	async getMain() {
		const ordersCount = this.prisma.order.count()
		const reviewsCount = this.prisma.review.count()
		const usersCount = this.prisma.user.count()

		return [
			{ name: 'Orders', value: ordersCount },
			{ name: 'Reviews', value: reviewsCount },
			{ name: 'Users', value: usersCount},
			{ name: 'Total amount', value: 1000 }
		]
	}
}
