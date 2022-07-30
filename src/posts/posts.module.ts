import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BloggersController } from 'src/bloggers/bloggers.controller';
import { BloggersRepository } from 'src/bloggers/bloggers.repository';
import { BloggersService } from 'src/bloggers/bloggers.service';
import { CommentsController } from 'src/comments/comments.controller';
import { CommentsRepository } from 'src/comments/comments.repository';
import { CommentsService } from 'src/comments/comments.service';
import { Blogger, BloggerSchema } from 'src/schemas/blogger.schema';
import { Comment, CommentSchema } from 'src/schemas/comment.schema';
import { Post, PostSchema } from 'src/schemas/post.schema';
import { PostsController } from './posts.controller';
import { PostsRepository } from './posts.repository';
import { PostsService } from './posts.service';

@Module({
  imports: [
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
  controllers: [PostsController, BloggersController,CommentsController],
  providers: [
    PostsService,
    PostsRepository,
    BloggersService,
    BloggersRepository,
    CommentsService,
    CommentsRepository
  ],
})
export class PostsModule {}
