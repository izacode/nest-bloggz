import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CommentsService } from 'src/comments/comments.service';
import { CreateCommentDto } from 'src/comments/dto/create-comment.dto';
import { FilterDto } from 'src/dto/filter.dto';
import { CreatePostDto } from './dto/create-post.dto';

import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';


@Controller('posts')
export class PostsController {
  constructor(
    protected postsService: PostsService,
    protected commentsService: CommentsService,
  ) {}

  @Get()
  async getPosts(@Query() filterDto: FilterDto) {
    return this.postsService.getPosts(filterDto);
  }
  @Post()
  async createPost(@Body() createPostDto: CreatePostDto) {
    const createdPost = await this.postsService.createPost(createPostDto);
    return createdPost;
  }
  @Get('/:id')
  async getPost(@Param('id') id: string) {
    const post = await this.postsService.getPost(id);
    return post;
  }
  @Put('/:id')
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const isUpdated: boolean = await this.postsService.updatePost(
      id,
      updatePostDto,
    );

    return isUpdated;
  }
  @Delete('/:id')
  async deletePost(@Param('id') id: string) {
    const isDeleted = await this.postsService.deletePost(id);
    return isDeleted;
  }

  @Get('/:id/comments')
  async getPostComments(
    @Param('id') id: string,
    @Query() filterDto: FilterDto,
  ) {
    await this.postsService.getPost(id);
    const postComments = await this.commentsService.getPostComments(
      id,
      filterDto,
    );
    return postComments;
  }
  @Post('/:id/comments')
  async createPostComment(
    @Param('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const post = await this.postsService.getPost(id);
    const newComment = await this.commentsService.createComment(
      id,
      createCommentDto,
    );
    return newComment;
  }
}
