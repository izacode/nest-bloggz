import { Matches } from 'class-validator';

export class EmailDto {
  @Matches(/^[\w\.]+@([\w]+\.)+[\w]{2,4}$/)
  email: string;
}
