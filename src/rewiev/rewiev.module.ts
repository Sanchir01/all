import { Module } from '@nestjs/common';
import { RewievService } from './rewiev.service';
import { RewievController } from './rewiev.controller';
import { PrismaService } from 'src/prisma.service';
import { ProductService } from 'src/product/product.service';
import { ProductModule } from 'src/product/product.module';
import { PaginationModule } from 'src/pagination/pagination.module';
import { CategoryModule } from 'src/category/category.module';

@Module({
  controllers: [RewievController],
  providers: [RewievService,PrismaService,ProductService],
  imports:[ProductModule,PaginationModule,CategoryModule]
})
export class RewievModule {}
