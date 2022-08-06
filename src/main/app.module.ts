import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { BloggersModule } from '../bloggers/bloggers.module';
import { CommentsModule } from '../comments/comments.module';
import { PostsModule } from '../posts/posts.module';


@Module({
  imports: [
    BloggersModule,
    PostsModule,
    CommentsModule,
    UsersModule,
    MongooseModule.forRoot(
      'mongodb+srv://thug:test1234@clusterblogg.gub0i.mongodb.net',
    ),
  ]
})

export class AppModule {}
