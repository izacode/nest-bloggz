import { Module} from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Post, PostSchema } from "src/schemas/post.schema";
import { PostsController } from "./posts.controller";
import { PostsRepository } from "./posts.repository";
import { PostsService } from "./posts.service";


@Module({
    imports : [
        MongooseModule.forFeature([{
            name: Post.name,
            schema: PostSchema
        }])
    ],
    controllers: [PostsController],
    providers: [PostsService,PostsRepository]
})


export class PostsModule {}