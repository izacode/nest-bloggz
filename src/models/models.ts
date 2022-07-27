import mongoose from 'mongoose';
import { BloggerSchema } from 'src/schemas/blogger.schema';
export const BloggerModel = mongoose.model('Blogger', BloggerSchema);

