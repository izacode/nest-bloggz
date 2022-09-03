import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blogger } from '../schemas/blogger.schema';
import { ExtendedLikesInfo, Post } from '../schemas/post.schema';
import { CustomResponseType } from '../types';
import { CreatePostDto } from './dto/create-post.dto';
import { FilterDto } from '../dto/filter.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ReactionsRepository } from '../likes/reactions.repository';
import { PostReaction } from 'src/schemas/post-reaction.schema';

@Injectable()
export class PostsRepository {
  constructor(private reactionsRepository: ReactionsRepository) {}

  @InjectModel(Post.name) private postModel: Model<Post>;
  @InjectModel(Blogger.name) private bloggerModel: Model<Blogger>;
  async getPosts(
    filterDto: FilterDto,
    userInfo?: any,
    bloggerId?: string,
  ): Promise<CustomResponseType> {
    const { SearchNameTerm, PageNumber = 1, PageSize = 10 } = filterDto;
    // let filter =
    //   SearchNameTerm === null && bloggerId === undefined
    //     ? {}
    //     : { title: { $regex: SearchNameTerm } };
    let filter: any;
    if (SearchNameTerm === null && bloggerId === undefined) filter = {};
    if (SearchNameTerm === null && bloggerId !== undefined)
      filter = { bloggerId };
    if (SearchNameTerm !== null && bloggerId === undefined)
      filter = { title: { $regex: SearchNameTerm } };
    if (SearchNameTerm !== null && bloggerId !== undefined)
      filter = { bloggerId, title: { $regex: SearchNameTerm } };

    const returnFilter = {
      _id: 0,
      __v: 0,
      'extendedLikesInfo._id': 0,
      'extendedLikesInfo.newestLikes': { _id: 0, postId: 0, likeStatus: 0 },
    };

    let posts: Post[];

    // ============================================================================================================================
    if (
      !userInfo ||
      !(await this.reactionsRepository.getUserAllPostsReactions(userInfo.sub))
    ) {
      posts = await this.postModel
        .find(filter, returnFilter)
        .skip((+PageNumber - 1) * +PageSize)
        .limit(+PageSize)
        .lean();

      if (posts.length !== 0) {
        posts.map(async (p) => {
          p.extendedLikesInfo.myStatus = 'None';
          // const lastThreePostLikeReactions =
          //   await this.reactionsRepository.getLastThreePostLikeReactions(p.id);
          // p.extendedLikesInfo.newestLikes = lastThreePostLikeReactions;
          if (p.extendedLikesInfo.newestLikes.length > 3)
            p.extendedLikesInfo.newestLikes.splice(
              3,
              p.extendedLikesInfo.newestLikes.length - 3,
            );
        });
      }
    } else {
      const userPostReactions =
        await this.reactionsRepository.getUserAllPostsReactions(userInfo.sub);
      // const returnFilter =
      //   '-_id -__v -extendedInfo._id -extendedLikesInfo.newestLikes._id -extendedLikesInfo.newestLikes._id -extendedLikesInfo.newestLikes.addedAt ';

      posts = await this.postModel
        .find(filter, returnFilter)
        .skip((+PageNumber - 1) * +PageSize)
        .limit(+PageSize)
        .lean();

      posts.map(async (p) => {
        p.extendedLikesInfo.myStatus = 'None';

        userPostReactions.forEach((r) => {
          if (r.postId === p.id) {
            p.extendedLikesInfo.myStatus = r.likeStatus;
          }
        });

        if (p.extendedLikesInfo.newestLikes.length > 3)
          p.extendedLikesInfo.newestLikes.splice(
            3,
            p.extendedLikesInfo.newestLikes.length - 3,
          );
        // let lastThreePostLikeReactions =
        //   await this.reactionsRepository.getLastThreePostLikeReactions(p.id);

        // p.extendedLikesInfo.newestLikes = lastThreePostLikeReactions;
        return p;
      });
    }

    // let postsToReturn = JSON.parse(JSON.stringify(posts));
    // postsToReturn.map(async (p) => {
    //   let lastThreePostLikeReactions =
    //     await this.reactionsRepository.getLastThreePostLikeReactions(p.id);

    //   p.extendedLikesInfo.newestLikes = lastThreePostLikeReactions;
    //   return p;
    // });

    //  =====================================================================================================

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
    // const bloggers = await this.bloggerModel.find().exec();

    await this.postModel.create(newPost);

    const createdPost = await this.postModel.findOne(
      { id: newPost.id },
      { _id: 0, __v: 0, 'extendedLikesInfo._id': 0 },
    );
    // if (!createdPost) return null;
    // const createdPostWithBloggerName: Post = Object.assign(createdPost, {
    //   bloggerName: bloggers.find((b) => b.id === newPost.bloggerId.toString())
    //     ?.name,
    // });

    return createdPost;
  }

  async getPost(id: string, userInfo?: any): Promise<Post> {
    let post = await this.postModel
      .findOne({ id }, { _id: 1, __v: 0, 'extendedLikesInfo._id': 0 })
      .exec();

    if (!post) throw new NotFoundException();

    if (
      !userInfo ||
      !(await this.reactionsRepository.getUsersPostReaction(id, userInfo.sub))
    ) {
      post.extendedLikesInfo.myStatus = 'None';
    } else {
      const userPostReaction =
        await this.reactionsRepository.getUsersPostReaction(id, userInfo.sub);

      post.extendedLikesInfo.myStatus = userPostReaction.likeStatus;
    }

    const lastThreePostLikeReactions =
      await this.reactionsRepository.getLastThreePostLikeReactions(id);
    post.extendedLikesInfo.newestLikes = lastThreePostLikeReactions;
    await post.save();
    post = await this.postModel
      .findOne(
        { id },
        {
          _id: 0,
          __v: 0,
          'extendedLikesInfo._id': 0,
          'extendedLikesInfo.newestLikes._id': 0,
        },
      )
      .exec();

    return post;
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

  // ============================= Get Post for reactioon=============================================================
  async getPostForReact(id: string, userInfo?: any): Promise<Post> {
    let post = await this.postModel
      .findOne(
        { id },
        {
          __v: 0,

          // 'extendedLikesInfo.newestLikes._id': 0,
        },
      )
      .exec();
    if (!post) throw new NotFoundException();

    // if (
    //   !userInfo ||
    //   !(await this.reactionsRepository.getUsersPostReaction(id, userInfo.sub))
    // ) {
    //   post.extendedLikesInfo.myStatus = 'None';
    // } else {
    //   const userPostReaction =
    //     await this.reactionsRepository.getUsersPostReaction(id, userInfo.sub);

    //   post.extendedLikesInfo.myStatus = userPostReaction.likeStatus;
    // }

    // const lastThreePostLikeReactions =
    //   await this.reactionsRepository.getLastThreePostLikeReactions(id);
    // post.extendedLikesInfo.newestLikes = lastThreePostLikeReactions;
    // await post.save();
    return post;
  }
  // =======================================================================================================================

  // async getAllBloggerPosts(
  //   id: string,
  //   filterDto: FilterDto,
  // ): Promise<CustomResponseType> {
  //   const { PageNumber, PageSize } = filterDto;

  //   const posts: Post[] = await this.postModel
  //     .find({ bloggerId: id }, '-_id -__v')
  //     .skip((+PageNumber - 1) * +PageSize)
  //     .limit(+PageSize)
  //     .exec();
  //   const totalCount: number = await this.postModel.countDocuments({
  //     bloggerId: id,
  //   });
  //   const customResponse = {
  //     pagesCount: Math.ceil(totalCount / +PageSize),
  //     page: +PageNumber,
  //     pageSize: +PageSize,
  //     totalCount,
  //     items: posts,
  //   };

  //   return customResponse;
  // }

  //  Get all Blogger's posts
  // async getAllBloggerPosts(
  //   id: string,
  //   filterDto: FilterDto,
  // ): Promise<CustomResponseType> {
  //   const posts = await this.getPosts(filterDto, null, id);

  //   return post;
  // }
}
