import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Attempt } from 'src/schemas/attempt.schema';
import { Blogger } from 'src/schemas/blogger.schema';
import { CommentReaction } from 'src/schemas/comment-reaction.schema';
import { Comment } from 'src/schemas/comment.schema';
import { PostReaction } from 'src/schemas/post-reaction.schema';
import { Post } from 'src/schemas/post.schema';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class TestingClearService {
  @InjectModel(Post.name) private postModel: Model<Post>;
  @InjectModel(Blogger.name) private bloggerModel: Model<Blogger>;
  @InjectModel(Comment.name) private commentModel: Model<Comment>;
  @InjectModel(Attempt.name) private attemptModel: Model<Attempt>;
  @InjectModel(PostReaction.name) private postReactionModel: Model<PostReaction>;
  @InjectModel(CommentReaction.name) private commentReactionModel: Model<CommentReaction>;
  @InjectModel(User.name) private userModel: Model<User>;
  async dropTestBase() {
    debugger;

    await this.bloggerModel.collection.drop();
    await this.postModel.collection.drop();
    await this.commentModel.collection.drop();
    await this.postReactionModel.collection.drop();
    await this.attemptModel.collection.drop();
    await this.commentReactionModel.collection.drop();
    await this.userModel.collection.drop();
    console.log(mongoose.connection.db);

    return;
  }
}
