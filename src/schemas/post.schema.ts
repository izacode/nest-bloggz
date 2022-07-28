import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema()
export class Post extends Document {
  @Prop()
  id: string;
  @Prop()
  title: string;
  @Prop()
  shortDescription: string;
  @Prop()
  content: string;
  @Prop()
  bloggerId: string;
  @Prop()
  bloggerName: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
