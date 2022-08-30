import { Injectable } from '@nestjs/common';
import { LikeStatusDto } from 'src/dto/like-status.dto';
import { ReactionsRepository } from './reactions.repository';

@Injectable()
export class ReactionsService {
  constructor(private reactionsRepository: ReactionsRepository) {}
  async createCommentReaction(
    commentId: string,
    userId: string,
    reactionStatus: LikeStatusDto,
  ) {
    const { likeStatus } = reactionStatus;

    const reaction = {
      commentId,
      userId,
      likeStatus,
    };
    console.log('reaction--', reaction);

    return this.reactionsRepository.createCommentReaction(reaction);
  }
  async createPostReaction(
    postId: string,
    userId: string,
    login: string,
    reactionStatus: LikeStatusDto,
  ) {
    const { likeStatus } = reactionStatus;

    const reaction = {
      userId,
      addedAt: new Date().toISOString(),
      login,
      postId,
      likeStatus,
    };
   

   await this.reactionsRepository.createPostReaction(reaction);
   return this.reactionsRepository.getUsersPostReaction(postId, userId);
  }
}
