import { Injectable } from '@nestjs/common';
import { CommentsRepository } from './comments.repository';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from 'src/schemas/comment.schema';
import { CustomResponseType } from 'src/types';
import { FilterDto } from 'src/dto/filter.dto';

@Injectable()
export class CommentsService {
  constructor(private commentsRepository: CommentsRepository) {}

  async createComment(
    id: string,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const { content } = createCommentDto;
    const newComment = {
      id: (+new Date()).toString(),
      content,
      postId: id,
      addedAt: new Date().toISOString(),
    };

    return this.commentsRepository.createComment(newComment);
  }

  async getPostComments(
    id: string,
    filterDto: FilterDto,
  ): Promise<CustomResponseType> {
    return this.commentsRepository.getPostComments(id, filterDto);
  }

  async getCommentById(id: string) {
    return this.commentsRepository.getCommentById(id);
  }

  async updateComment(id: string, updateCommentDto: UpdateCommentDto) {
    return this.commentsRepository.updateComment(id, updateCommentDto);
  }

  async deleteComment(id: string): Promise<boolean> {
    return this.commentsRepository.deleteComment(id);
  }
}
