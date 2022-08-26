import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { BloggersModule } from './bloggers/bloggers.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { UsersModule } from './users/users.module';

import { TestingClearModule } from './testing/testing-clear.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    BloggersModule,
    PostsModule,
    CommentsModule,
    UsersModule,
    TestingClearModule,
    MongooseModule.forRoot(
      `mongodb+srv://thug:${process.env.MONGO_PASSWORD}@clusterblogg.gub0i.mongodb.net`,
      // 'mongodb+srv://thug:test1234@clusterblogg.gub0i.mongodb.net',
    ),
  ],
})
export class AppModule {}
