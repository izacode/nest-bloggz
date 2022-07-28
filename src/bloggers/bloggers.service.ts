import { Injectable } from '@nestjs/common';

import { CustomResponseType } from 'src/types';

import { BloggersRepository } from './bloggers.repository';
import { CreateBloggerDto } from './dto/create-blogger.dto';
import { FilterDto } from '../dto/filter.dto';
import { UpdateBloggerDto } from './dto/update-blogger.dto';

@Injectable()
export class BloggersService {
  constructor(protected bloggersRepository: BloggersRepository) {}

  async getBloggers(
    filterDto: FilterDto,
  ): Promise<CustomResponseType> {
    return this.bloggersRepository.getBloggers(filterDto);
  }

  async createBlogger(createBloggerDto: CreateBloggerDto) {
    const { name, youtubeUrl } = createBloggerDto;
    const newBlogger = {
      id: (+new Date()).toString(),
      name,
      youtubeUrl,
    };

    return this.bloggersRepository.createBlogger(newBlogger);
  }

  async getBlogger(id: string) {
    return this.bloggersRepository.getBlogger(id);
  }
  async updateBlogger(
    id: string,
    updateBloggerDto: UpdateBloggerDto,
  ): Promise<boolean> {
    return this.bloggersRepository.updateBlogger(id, updateBloggerDto);
  }

  async deleteBlogger(id:string): Promise<boolean>{
    return this.bloggersRepository.deleteBlogger(id)
  }

  async deleteAllBloggers():Promise<boolean>{
    return this.bloggersRepository.deleteAllBloggers()
  }

}
