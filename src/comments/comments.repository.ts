import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from '../schemas/comment.schema';
import { FilterDto } from '../dto/filter.dto';
import { CustomResponseType } from '../types';
import { ReactionsRepository } from '../likes/reactions.repository';

@Injectable()
export class CommentsRepository {
  constructor(
    private reactionsRepository: ReactionsRepository,
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
  ) {}

  async getCommentById(id: string, userInfo?: any): Promise<Comment> {
    let comment = await this.commentModel.findOne({ id }, '-__v');
    if (!comment) throw new NotFoundException();
    if (
      !userInfo ||
      !(await this.reactionsRepository.getUsersAllCommentsReactions(
        userInfo.sub,
      ))
    ) {
      comment.likesInfo.myStatus = 'None';
    } else {
      const userCommentReaction =
        await this.reactionsRepository.getUsersCommentReaction(
          id,
          userInfo.sub,
        );

      comment.likesInfo.myStatus = userCommentReaction.likeStatus;
    }
    return comment;
  }

  async createComment(newComment: any): Promise<Comment> {
    await this.commentModel.create(newComment);
    const comment = this.commentModel.findOne(
      { id: newComment.id },
      { postId: 0 },
    );
    return comment;
  }

  async getPostComments(
    id: string,
    filterDto: FilterDto,
    userInfo?: any,
  ): Promise<CustomResponseType> {
    const { PageNumber, PageSize } = filterDto;
    console.log(userInfo);

    let postComments: Comment[];
    if (
      !userInfo ||
      !(await this.reactionsRepository.getUsersAllCommentsReactions(
        userInfo.sub,
      ))
    ) {
      postComments = await this.commentModel
        .find({ postId: id }, '-_id -__v -likesInfo._id')
        .skip((+PageNumber - 1) * +PageSize)
        .limit(+PageSize)
        .exec();

      if (postComments.length !== 0) {
        postComments.map((c) => (c.likesInfo.myStatus = 'None'));
      }
    } else {
      const userCommentsReactions =
        await this.reactionsRepository.getUsersAllCommentsReactions(
          userInfo.sub,
        );

      postComments = (
        await this.commentModel
          .find({ postId: id }, '-_id -__v -likesInfo._id')
          .skip((+PageNumber - 1) * +PageSize)
          .limit(+PageSize)
          .exec()
      ).map((c) => {
        userCommentsReactions.forEach((r) => {
          if (r.commentId === c.id)
            return (c.likesInfo.myStatus = r.likeStatus);
        });
        // c.likesInfo.myStatus = 'None';
        return c;
      });
    }

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
