import { Module } from '@nestjs/common';
import { FacebookController } from './facebook.controller';
import { FacebookService } from './facebook.service';
import { PrismaModule } from '@app/prisma/prisma.module';
import { GeminiService } from '../gemini/gemini.service';

@Module({
  imports: [],
  controllers: [FacebookController],
  providers: [FacebookService, GeminiService],
})
export class FacebookModule {}
