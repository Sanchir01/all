import { faker } from '@faker-js/faker'
import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import { hash, verify } from 'argon2'
import { PrismaService } from 'src/prisma.service'
import { AuthDto } from './dto/Auth.dto'
import { LoginDto } from './dto/Login.dto'
import { RefreshDto } from './dto/Refresh.dro'

@Injectable()
export class AuthService {
	constructor(private prisma: PrismaService, private jwt: JwtService) {}

	async register(dto: AuthDto) {
		const oldUser = await this.prisma.user.findUnique({
			where: { email: dto.email }
		})
		if (oldUser) throw new BadRequestException(`User already registered`)

		const user = await this.prisma.user.create({
			data: {
				email: dto.email,
				password: await hash(dto.password),
				name: dto.name,
				avatarPath: faker.image.avatar(),
				phone: faker.phone.number()
			}
		})

		const token = await this.issueTokens(user.id)
		return {
			...token,
			user: this.returnUserFields(user)
		}
	}

	async login(dto: LoginDto) {
		const user = await this.validateUser(dto)
		const token = await this.issueTokens(user.id)
		return {
			...token,
			user: this.returnUserFields(user)
		}
	}
	async getNewTokens(dto: RefreshDto) {
		const result = await this.jwt.verify(dto.refreshToken)
		if (!result) throw new UnauthorizedException('Невалидный токен')

		const user = await this.prisma.user.findUnique({
			where: { id: result.id }
		})

		const token = await this.issueTokens(user.id)
		return {
			...token,
			user: this.returnUserFields(user)
		}
	}

	private async issueTokens(userId: number) {
		const data = { id: userId }

		const accessToken = this.jwt.sign(data, {
			expiresIn: '7d'
		})

		const refreshToken = this.jwt.sign(data, {
			expiresIn: '7d'
		})

		return { accessToken, refreshToken }
	}

	private returnUserFields(user: User) {
		return {
			id: user.id,
			email: user.email
		}
	}

	private async validateUser(dto: LoginDto) {
		const user = await this.prisma.user.findUnique({
			where: { email: dto.email }
		})
		if (!user) throw new NotFoundException('User already exists')

		const isValid = await verify(user.password, dto.password)
		if (!isValid) throw new UnauthorizedException('Invalid password')

		return user
	}
}
