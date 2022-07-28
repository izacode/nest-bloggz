import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Blogger } from 'src/schemas/blogger.schema';
import { CustomResponseType } from 'src/types';
import { BloggersService } from './bloggers.service';
import { CreateBloggerDto } from './dto/create-blogger.dto';
import { FilterDto } from '../dto/filter.dto';
import { UpdateBloggerDto } from './dto/update-blogger.dto';
import { CreatePostDto } from 'src/posts/dto/create-post.dto';
import { PostsService } from 'src/posts/posts.service';

@Controller('bloggers')
export class BloggersController {
  constructor(protected bloggersService: BloggersService, private postsService: PostsService) {}

  @Get()
  async getBloggers(
    @Query() filterDto: FilterDto,
  ): Promise<CustomResponseType> {
    return this.bloggersService.getBloggers(filterDto);
  }

  @Post()
  async createBlogger(@Body() createBloggerDto: CreateBloggerDto) {
    const newBlogger: Blogger = await this.bloggersService.createBlogger(
      createBloggerDto,
    );
    return newBlogger;
  }

  @Get('/:id')
  async getBlogger(@Param('id') id: string) {
    const foundBlogger: Blogger = await this.bloggersService.getBlogger(id);
    return foundBlogger;
  }
  @Put('/:id')
  @HttpCode(204)
  async updateBlogger(
    @Param('id') id: string,
    @Body() updateBloggerDto: UpdateBloggerDto,
  ) {
    await this.bloggersService.getBlogger(id);
    const isUpdated: boolean = await this.bloggersService.updateBlogger(
      id,
      updateBloggerDto,
    );
    return isUpdated;
  }
  @Delete('/:id')
  //   @HttpCode(204)
  async deleteBlogger(@Param('id') id: string) {
    await this.bloggersService.getBlogger(id);
    const isDeleted: boolean = await this.bloggersService.deleteBlogger(id);
    return isDeleted;
  }
  @Delete()
  @HttpCode(204)
  async deleteAllBloggers() {
    const isDeleted: boolean = await this.bloggersService.deleteAllBloggers();
    return isDeleted;
  }

  @Get('/:id/posts')
  async getBloggerPosts(
    @Param('id') id: string,
    @Query() filterDto: FilterDto,
  ) {
    const bloggerPosts = await this.postsService.getAllBloggerPosts(
      id,
      filterDto,
    );
    return bloggerPosts;
  }

  @Post('/:id/posts')
  async createBloggerPost(@Param('id') id: string, @Body()createPostDto: CreatePostDto) {

    const newPost = await this.postsService.createPost(createPostDto,id);

    return newPost
  }
}  

