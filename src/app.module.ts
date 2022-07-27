import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BloggersModule } from './bloggers/bloggers.module';

@Module({
  imports: [
    BloggersModule,
    MongooseModule.forRoot(
      'mongodb+srv://thug:test1234@clusterblogg.gub0i.mongodb.net',
    ),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
