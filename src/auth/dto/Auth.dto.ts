import { IsEmail, IsString, MinLength } from 'class-validator'

export class AuthDto {
	@IsEmail()
	email: string

	@IsString()
	@MinLength(6, {
		message: 'Min 6 length'
	})
	password: string

	@IsString()
	name: string
}
