import { Injectable, NotFoundException } from '@nestjs/common';
import { FilterDto } from '../dto/filter.dto';

import { ExtendedLikesInfo, Post } from '../schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsRepository } from './posts.repository';
import { BloggersRepository } from '../bloggers/bloggers.repository';
import { Blogger } from '../schemas/blogger.schema';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LikeStatusDto } from '../dto/like-status.dto';
import { ReactionsRepository } from '../likes/reactions.repository';
import { ReactionsService } from '../likes/reactions.service';

@Injectable()
export class PostsService {
  constructor(
    private postsRepository: PostsRepository,
    private bloggersRepository: BloggersRepository,
    private jwtService: JwtService,
    private config: ConfigService,
    private reactionsRepository: ReactionsRepository,
    private reactionsService: ReactionsService,
  ) {}
  async getPosts(filterDto: FilterDto, headers: any, bloggerId?: string) {
    try {
      let accessToken: string;
      if (headers?.authorization)
        accessToken = headers.authorization.split(' ')[1];
      const userInfo = await this.jwtService.verify(accessToken, {
        secret: await this.config.get('ACCESS_TOKEN_SECRET'),
      });

      return this.postsRepository.getPosts(filterDto, userInfo, bloggerId);
    } catch {
      return this.postsRepository.getPosts(filterDto, null, bloggerId);
    }
  }

  async createPost(
    createPostDto: CreatePostDto,
    id?: string,
  ): Promise<Post | null> {
    const { title, shortDescription, content } = createPostDto;
    const bloggerId: string = id || createPostDto.bloggerId;

    const blogger: Blogger = await this.bloggersRepository.getBlogger(
      bloggerId,
    );

    if (!blogger) throw new NotFoundException();

    const newPost: Post = {
      id: (+new Date()).toString(),
      title,
      shortDescription,
      content,
      bloggerId,
      bloggerName: blogger.name,
      addedAt: new Date().toISOString(),
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      } as ExtendedLikesInfo,
    } as Post;
    return this.postsRepository.createPost(newPost);
  }

  async getPost(id: string, headers?: any): Promise<Post | null> {
    try {
      let accessToken: string;
      if (headers?.authorization)
        accessToken = headers.authorization.split(' ')[1];
      const userInfo = await this.jwtService.verify(accessToken, {
        secret: await this.config.get('ACCESS_TOKEN_SECRET'),
      });
      debugger;
      return this.postsRepository.getPost(id, userInfo);
    } catch {
      return this.postsRepository.getPost(id);
    }
  }

  async updatePost(id: string, updatePostDto: UpdatePostDto): Promise<boolean> {
    return this.postsRepository.updatePost(id, updatePostDto);
  }

  async deletePost(id: string): Promise<boolean> {
    return this.postsRepository.deletePost(id);
  }

  async deleteAllPosts(): Promise<boolean> {
    return this.postsRepository.deleteAllPosts();
  }

  // async getAllBloggerPosts(
  //   id: string,
  //   filterDto: FilterDto,
  // ): Promise<CustomResponseType> {
  //   return this.postsRepository.getAllBloggerPosts(id, filterDto);
  // }

  // React on post ======================================================================================================================
  async reactOnPost(
    id: string,
    likeStatusDto: LikeStatusDto,
    currentUserData: any,
  ) {
    const { likeStatus } = likeStatusDto;
    let post = await this.postsRepository.getPost(id);

    const currentUserPostReaction =
      await this.reactionsRepository.getUsersPostReaction(
        id,
        currentUserData.sub,
      );

    // If user hasn't reacted before
    if (!currentUserPostReaction) {
      console.log(
        'if there is no reaction, currentUserData.sub--',
        currentUserData.sub,
      );

      const reaction = await this.reactionsService.createPostReaction(
        id,
        currentUserData.sub,
        currentUserData.username,
        likeStatusDto,
      );

      post.extendedLikesInfo.myStatus = reaction.likeStatus;
      if (reaction.likeStatus === 'Like') {
        post.extendedLikesInfo.likesCount++;
      } else if (reaction.likeStatus === 'Dislike') {
        post.extendedLikesInfo.dislikesCount++;
      }
      post.save();
      return;
    }

    // If user has reacted before
    if (likeStatus === 'Like') {
      if (currentUserPostReaction.likeStatus === 'Like') return;
      if (currentUserPostReaction.likeStatus === 'Dislike') {
        post.extendedLikesInfo.myStatus = 'Like';
        post.extendedLikesInfo.dislikesCount--;
        post.extendedLikesInfo.likesCount++;
        post.save();

        currentUserPostReaction.likeStatus = 'Like';
        currentUserPostReaction.save();
        return;
      }
      if (currentUserPostReaction.likeStatus === 'None') {
        post.extendedLikesInfo.myStatus = 'Like';
        post.extendedLikesInfo.likesCount++;
        post.save();

        currentUserPostReaction.likeStatus = 'Like';
        currentUserPostReaction.save();
        return;
      }
    } else if (likeStatus === 'Dislike') {
      debugger;
      if (currentUserPostReaction.likeStatus === 'Dislike') return;
      if (currentUserPostReaction.likeStatus === 'Like') {
        post.extendedLikesInfo.myStatus = 'Dislike';
        post.extendedLikesInfo.dislikesCount++;
        post.extendedLikesInfo.likesCount--;
        post.save();

        currentUserPostReaction.likeStatus = 'Dislike';
        currentUserPostReaction.save();
        return;
      }
      if (currentUserPostReaction.likeStatus === 'None') {
        post.extendedLikesInfo.myStatus = 'Dislike';
        post.extendedLikesInfo.dislikesCount++;
        post.save();

        currentUserPostReaction.likeStatus = 'Dislike';
        currentUserPostReaction.save();
        return;
      }
    } else {
      if (currentUserPostReaction.likeStatus === 'Dislike') {
        post.extendedLikesInfo.myStatus = 'None';
        post.extendedLikesInfo.dislikesCount--;
        post.save();

        currentUserPostReaction.likeStatus = 'None';
        currentUserPostReaction.save();
        return;
      }
      if (currentUserPostReaction.likeStatus === 'Like') {
        post.extendedLikesInfo.myStatus = 'None';
        post.extendedLikesInfo.likesCount--;
        post.save();

        currentUserPostReaction.likeStatus = 'None';
        currentUserPostReaction.save();
        return;
      }
    }
  }
}
