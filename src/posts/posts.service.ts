import { Injectable } from '@nestjs/common';
import { FilterDto } from 'src/dto/filter.dto';
import { CustomResponseType } from 'src/types';
import { Post } from 'src/schemas/post.schema';

import { CreatePostDto } from './dto/create-post.dto';

import { UpdatePostDto } from './dto/update-post.dto';
import { PostsRepository } from './posts.repository';

@Injectable()
export class PostsService {
  constructor(private postsRepository: PostsRepository) {}
  async getPosts(filterDto: FilterDto) {
    return this.postsRepository.getPosts(filterDto);
  }

  async createPost(
    createPostDto: CreatePostDto,
    id?: string,
  ): Promise<Post | null> {
    const { title, shortDescription, content } = createPostDto;
    const bloggerId: string = id || createPostDto.bloggerId;
    const newPost = {
      id: (+new Date()).toString(),
      title,
      shortDescription,
      content,
      bloggerId,
    };
    return this.postsRepository.createPost(newPost);
  }

  async getPost(id: string): Promise<Post | null> {
    return this.postsRepository.getPost(id);
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

  async getAllBloggerPosts(id: string, filterDto: FilterDto):Promise<CustomResponseType> {
    return this.postsRepository.getAllBloggerPosts(id, filterDto);
  }
}
