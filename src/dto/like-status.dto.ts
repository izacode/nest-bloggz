import { IsNotEmpty } from "class-validator";


export class LikeStatusDto {
    @IsNotEmpty()
    likeStatus: string
}