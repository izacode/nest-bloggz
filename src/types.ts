import { Blogger } from "./schemas/blogger.schema";
import { Post } from "./schemas/post.schema";


export class CustomResponseType{
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Blogger[] | Post[]
};
