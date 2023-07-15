import { Body, Controller, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthDto } from './dto/Auth.dto'
import { LoginDto } from './dto/Login.dto'
import { RefreshDto } from './dto/Refresh.dro'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UsePipes(new ValidationPipe())
	@Post('register')
	@HttpCode(200)
	async register(@Body() dto: AuthDto) {
		return await this.authService.register(dto)
	}
	@UsePipes(new ValidationPipe())
	@Post('login')
	@HttpCode(200)
	async login(@Body() dto: LoginDto) {
		return await this.authService.login(dto)
	}

	@UsePipes(new ValidationPipe())
	@Post('login/access-token')
	@HttpCode(200)
	async getNewTokens(@Body() dto: RefreshDto) {
		return await this.authService.getNewTokens(dto)
	}
}
