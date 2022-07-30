import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get('/:id')
  async getCommentById(@Param('id') id: string) {
    const comment = await this.commentsService.getCommentById(id)
    return comment
  }

  @Put("/:id")
  async updateComment(@Param("id")id:string, @Body() updateCommentDto: UpdateCommentDto) {
    const isUpdated = await this.commentsService.updateComment(id,updateCommentDto)
    return isUpdated
  }

  @Delete("/:id")
  async deleteComment(@Param("id")id: string){
    const isDeleted = await this.commentsService.deleteComment(id)
    return isDeleted
  }

  
}
