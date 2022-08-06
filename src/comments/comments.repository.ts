import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from 'src/schemas/comment.schema';
import { FilterDto } from 'src/dto/filter.dto';
import { CustomResponseType } from 'src/main/types';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
  ) {}

  async getCommentById(id: string): Promise<Comment> {
    const comment = await this.commentModel.findOne({ id }, '-__v');
    if (!comment) throw new NotFoundException();
    return comment;
  }

  async createComment(newComment: any): Promise<Comment> {
    await this.commentModel.create(newComment);
    return newComment;
  }

  async getPostComments(
    id: string,
    filterDto: FilterDto,
  ): Promise<CustomResponseType> {
    const { PageNumber, PageSize } = filterDto;
    const postComments: Comment[] = await this.commentModel
      .find({ postId: id }, '-_id -__v')
      .skip((+PageNumber - 1) * +PageSize)
      .limit(+PageSize)
      .exec();

    const totalCount: number = await this.commentModel.countDocuments({
      postId: id,
    });

    const customResponse: CustomResponseType = {
      pagesCount: Math.ceil(totalCount / +PageSize),
      page: +PageNumber,
      pageSize: +PageSize,
      totalCount,
      items: postComments,
    };
    return customResponse;
  }

  async updateComment(
    id: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<boolean> {
    const { content } = updateCommentDto;
    const commentToUpdate = await this.getCommentById(id);

    commentToUpdate.content = content;
    await commentToUpdate.save();
    return true;
  }

  async deleteComment(id: string): Promise<boolean> {
    const isDeleted = await this.commentModel.deleteOne({ id });
    return isDeleted.deletedCount === 1;
  }
}
