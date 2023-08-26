import {
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Post,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Auth } from 'src/decorators/auth.decorator'
import { CurrentUser } from 'src/decorators/user.decorator'
import { ReviewDto } from './dto/review.dto'
import { RewievService } from './rewiev.service'

@Controller('rewiev')
export class RewievController {
	constructor(private readonly rewievService: RewievService) {}

	@UsePipes(new ValidationPipe())
	@Get()
	@Auth('admin')
	async getAll() {
		return this.rewievService.getAll()
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('leave/:productId')
	@Auth()
	async leaveReview(
		@Param('productId') productId: string,
		@Body() dto: ReviewDto,
		@CurrentUser('id') id: number
	) {
		return this.rewievService.create(id, dto, +productId)
	}

	@Get('average-by-product/:productId')
	async getAverageByProduct(@Param('productId') productId:number){
		return this.rewievService.getAverageValueByProductId(+productId)
	}
}
