import { IsEmail, IsString, MinLength } from 'class-validator'

export class LoginDto {
	@IsEmail()
	email: string

	@IsString()
	@MinLength(6, {
		message: 'Min 6 length'
	})
	password: string
}
