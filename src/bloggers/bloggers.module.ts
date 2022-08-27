import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';


import { BloggersController } from './bloggers.controller';
import { BloggersRepository } from './bloggers.repository';
import { BloggersService } from './bloggers.service';
import { Post, PostSchema } from '../schemas/post.schema';
import { PostsModule } from '../posts/posts.module';
import { Blogger, BloggerSchema } from '../schemas/blogger.schema';
import { Comment, CommentSchema } from '../schemas/comment.schema';

@Module({
  imports: [
    forwardRef(() => PostsModule),

    MongooseModule.forFeature([
      {
        name: Post.name,
        schema: PostSchema,
      },
      {
        name: Blogger.name,
        schema: BloggerSchema,
      },
      {
        name: Comment.name,
        schema: CommentSchema,
      },
    ]),
  ],
  controllers: [BloggersController],
  providers: [BloggersService, BloggersRepository],
  exports: [BloggersService, BloggersRepository],
})
export class BloggersModule {}
