import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blogger, BloggerSchema } from 'src/schemas/blogger.schema';
import { BloggersController } from './bloggers.controller';
import { BloggersRepository } from './bloggers.repository';
import { BloggersService } from './bloggers.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Blogger.name,
        schema: BloggerSchema,
      },
    ]),
  ],
  controllers: [BloggersController],
  providers: [BloggersService, BloggersRepository],
})
export class BloggersModule {}
