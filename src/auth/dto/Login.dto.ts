import { IsEmail, IsString, MinLength } from 'class-validator'

export class LoginDto {
	@IsEmail()
	email: string

	@IsString()
	@MinLength(5, {
		message: 'Min 6 length'
	})
	password: string
}
