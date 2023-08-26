import { IsString } from 'class-validator';


export class createCategoryDto  {
   @IsString()
   name:string
}