import { Module } from '@nestjs/common';
import { RewievService } from './rewiev.service';
import { RewievController } from './rewiev.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [RewievController],
  providers: [RewievService,PrismaService]
})
export class RewievModule {}
