import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BloggersController } from 'src/bloggers/bloggers.controller';
import { BloggersRepository } from 'src/bloggers/bloggers.repository';
import { BloggersService } from 'src/bloggers/bloggers.service';
import { PostsController } from 'src/posts/posts.controller';
import { PostsRepository } from 'src/posts/posts.repository';
import { PostsService } from 'src/posts/posts.service';
import { Blogger, BloggerSchema } from 'src/schemas/blogger.schema';
import { Comment, CommentSchema } from 'src/schemas/comment.schema';
import { Post, PostSchema } from 'src/schemas/post.schema';
import { CommentsController } from './comments.controller';
import { CommentsRepository } from './comments.repository';
import { CommentsService } from './comments.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Comment.name,
        schema: CommentSchema,
      },
      {
        name: Post.name,
        schema: PostSchema,
      },
      {
        name: Blogger.name,
        schema: BloggerSchema,
      },
    ]),
  ],
  controllers: [CommentsController, PostsController, BloggersController],
  providers: [
    CommentsService,
    CommentsRepository,
    PostsService,
    PostsRepository,
    BloggersService,
    BloggersRepository,
  ],
})
export class CommentsModule {}
