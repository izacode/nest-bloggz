import { Injectable, NotFoundException } from '@nestjs/common';
import { Blogger } from '../schemas/blogger.schema';
import { CustomResponseType } from 'src/types';
import { CreateBloggerDto } from './dto/create-blogger.dto';
import { FilterDto } from '../dto/filter.dto';
import { UpdateBloggerDto } from './dto/update-blogger.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class BloggersRawSqlRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async getBloggers(filterDto: FilterDto): Promise<CustomResponseType> {
    const { SearchNameTerm, PageNumber, PageSize } = filterDto;
    const offset = (+PageNumber - 1) * +PageSize || 0;
    const bloggers = await this.dataSource.query(
      `
     SELECT id, name, "youtubeUrl"
     FROM bloggers
     WHERE bloggers.name LIKE ('%'||$1||'%') 
     LIMIT $2 OFFSET $3
    `,
      [SearchNameTerm, PageSize, offset],
    );

    const totalCount: number = +(
      await this.dataSource.query(`
      SELECT Count(*)
	    FROM public.bloggers`)
    )[0].count;

    const customResponse = {
      pagesCount: Math.ceil(totalCount / +PageSize),
      page: +PageNumber,
      pageSize: +PageSize,
      totalCount,
      items: bloggers,
    };

    return customResponse;
  }

  async createBlogger(newBlogger: CreateBloggerDto): Promise<Blogger> {
    const { id, name, youtubeUrl } = newBlogger;
    await this.dataSource.query(
      `
    INSERT INTO public.bloggers ("id", "name", "youtubeUrl")
	  VALUES ($1, $2, $3)`,
      [id, name, youtubeUrl],
    );
    return newBlogger as Blogger;
  }

  async getBlogger(id: string): Promise<Blogger> {
    const foundBlogger = await this.dataSource.query(
      `
    SELECT id, name, "youtubeUrl"
	  FROM "bloggers"
    WHERE id = $1`,
      [id],
    );
    if (foundBlogger.length === 0) throw new NotFoundException({});
    return foundBlogger as Blogger;
  }

  async updateBlogger(
    id: string,
    updateBloggerDto: UpdateBloggerDto,
  ): Promise<boolean> {
    const { name, youtubeUrl } = updateBloggerDto;
    await this.getBlogger(id);
    await this.dataSource.query(
      `
     UPDATE public.bloggers
	   SET name=$2, "youtubeUrl"=$3
	   WHERE id= $1`,
      [id, name, youtubeUrl],
    );
    return true;
  }

  async deleteBlogger(id: string): Promise<boolean> {
    await this.getBlogger(id);
    await this.dataSource.query(
      `
    DELETE FROM public.bloggers
	  WHERE id= $1;`,
      [id],
    );
    return true;
  }
  
}