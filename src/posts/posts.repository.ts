import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blogger } from 'src/schemas/blogger.schema';
import { Post } from 'src/schemas/post.schema';
import { CustomResponseType } from 'src/main/types';
import { CreatePostDto } from './dto/create-post.dto';
import { FilterDto } from '../dto/filter.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsRepository {
  @InjectModel(Post.name) private postModel: Model<Post>;
  @InjectModel(Blogger.name) private bloggerModel: Model<Blogger>;
  async getPosts(filterDto: FilterDto): Promise<CustomResponseType> {
    const { SearchNameTerm, PageNumber = 1, PageSize = 10 } = filterDto;
    let filter =
      SearchNameTerm === undefined ? {} : { title: { $regex: SearchNameTerm } };

    const posts: Post[] = await this.postModel
      .find(filter, '-_id -__v')
      .skip((+PageNumber - 1) * +PageSize)
      .limit(+PageSize)
      .exec();
    const totalCount: number = await this.postModel.countDocuments(filter);
    const customResponse = {
      pagesCount: Math.ceil(totalCount / +PageSize),
      page: +PageNumber,
      pageSize: +PageSize,
      totalCount,
      items: posts,
    };

    return customResponse;
  }

  async createPost(newPost: CreatePostDto): Promise<Post | null> {
    const bloggers = await this.bloggerModel.find().exec();

    await this.postModel.create(newPost);

    const createdPost = await this.postModel.findOne(
      { id: newPost.id },
      '-_id -__v',
    );
    if (!createdPost) return null;
    const createdPostWithBloggerName: Post = Object.assign(createdPost, {
      bloggerName: bloggers.find((b) => b.id === newPost.bloggerId.toString())
        ?.name,
    });
    return createdPostWithBloggerName;
  }

  async getPost(id: string): Promise<Post> {
    const bloggers = await this.bloggerModel.find().exec();
    const post = await this.postModel.findOne({ id }, '-__v').exec();
    if (!post) throw new NotFoundException();
    const postWithBloggerName: Post = Object.assign(post, {
      bloggerName: bloggers.find((b) => b.id === post?.bloggerId.toString())
        ?.name,
    });
    return postWithBloggerName;
  }

  async updatePost(id: string, updatePostDto: UpdatePostDto): Promise<boolean> {
    const { title, shortDescription, content, bloggerId } = updatePostDto;
    const postToUpdate = await this.getPost(id);

    postToUpdate.title = title;
    postToUpdate.shortDescription = shortDescription;
    postToUpdate.content = content;
    postToUpdate.bloggerId = bloggerId;
    await postToUpdate.save();
    return true;
  }

  async deletePost(id: string): Promise<boolean> {
    const isDeleted = await this.postModel.deleteOne({ id });
    return isDeleted.deletedCount === 1;
  }

  async deleteAllPosts(): Promise<boolean> {
    await this.postModel.deleteMany({});
    const totalCount: number = await this.postModel.countDocuments();
    if (totalCount !== 0) return false;
    return true;
  }

  async getAllBloggerPosts(
    id: string,
    filterDto: FilterDto,
  ): Promise<CustomResponseType> {
    const { PageNumber, PageSize } = filterDto;

    const posts: Post[] = await this.postModel
      .find({ bloggerId: id }, '-_id -__v')
      .skip((+PageNumber - 1) * +PageSize)
      .limit(+PageSize)
      .exec();
    const totalCount: number = await this.postModel.countDocuments({
      bloggerId: id,
    });
    const customResponse = {
      pagesCount: Math.ceil(totalCount / +PageSize),
      page: +PageNumber,
      pageSize: +PageSize,
      totalCount,
      items: posts,
    };

    return customResponse;
  }
}
