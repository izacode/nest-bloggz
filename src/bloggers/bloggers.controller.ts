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
import { GetBloggersFilterDto } from './dto/get-bloggers-filter.dto';
import { UpdateBloggerDto } from './dto/update-blogger.dto';

@Controller('bloggers')
export class BloggersController {
  constructor(protected bloggersService: BloggersService) {}

  @Get()
  async getBloggers(
    @Query() filterDto: GetBloggersFilterDto,
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
}

//   async getBloggerPosts(req: Request, res: Response) {
//     const { PageNumber = 1, PageSize = 10 } = req.query as QueryType;
//     const bloggerPosts = await this.bloggersService.getAllBloggerPosts(
//       req.params.bloggerId,
//       PageNumber,
//       PageSize,
//     );
//     bloggerPosts ? res.json(bloggerPosts) : res.sendStatus(404);
//   }

//   async createBloggerPost(req: Request, res: Response) {
//     const { body, params } = req;
//     const newPost = await this.postsService.createPost(body, params);

//     newPost ? res.status(201).json(newPost) : res.sendStatus(404);
//   }
//
