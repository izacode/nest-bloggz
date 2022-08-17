import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BloggersModule } from 'src/bloggers/bloggers.module';
import { CommentsModule } from 'src/comments/comments.module';
import { Blogger, BloggerSchema } from 'src/schemas/blogger.schema';
import { Comment, CommentSchema } from 'src/schemas/comment.schema';
import { Post, PostSchema } from 'src/schemas/post.schema';
import { PostsController } from './posts.controller';
import { PostsRepository } from './posts.repository';
import { PostsService } from './posts.service';
import { forwardRef} from '@nestjs/common';

@Module({
  imports: [
    forwardRef(() => BloggersModule),
    CommentsModule,
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
  controllers: [PostsController],
  providers: [PostsService, PostsRepository],
  exports: [PostsService, PostsRepository],
})
export class PostsModule {}
