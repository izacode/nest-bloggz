import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Comment extends Document {
  @Prop()
  id: string;
  @Prop()
  postId: string;
  @Prop()
  content: string;
  // @Prop()
  // userId: string;
  // @Prop()
  // userLogin: string;
  @Prop()
  addedAt: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment)
