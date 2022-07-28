import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { FilterDto } from 'src/dto/filter.dto';
import { CreatePostDto } from './dto/create-post.dto';

import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(
    protected postsService: PostsService,
    // protected commentsService: CommentsService,
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
@Delete("/:id")
  async deletePost(@Param("id") id: string) {
    const isDeleted = await this.postsService.deletePost(id);
    return isDeleted
  }

  // async getPostComments(req: Request, res: Response) {
  //   const { PageNumber = 1, PageSize = 10 } = req.query as QueryType;
  //   const post = await this.postsService.getPost(req.params.id);
  //   if (!post) return res.sendStatus(404);
  //   const postComments = await this.commentsService.getAllPostComments(
  //     post.id!,
  //     PageNumber,
  //     PageSize,
  //   );
  //   res.send(postComments);
  // }

  // async createPostComment(req: Request, res: Response) {
  //   const post = await this.postsService.getPost(req.params.id);
  //   if (!post) return res.sendStatus(404);
  //   const newComment = await this.commentsService.createComment(
  //     req.params.id,
  //     req.body.content,
  //     req.context.user!._id,
  //     req.context.user!.accountData.userName,
  //   );
  //   res.status(201).send(newComment);
  // }
}
