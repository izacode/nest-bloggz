import { Blogger } from "./bloggers/blogger.model";

export class CustomResponseType{
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Blogger[] 
};
