import { IsNotEmpty, IsOptional } from "class-validator";
import { Category } from "src/lib/enums";

export class HopCreationDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  logo: string;

  @IsNotEmpty()
  instagramAccount: string;

  @IsOptional()
  descrtiption: string;

  @IsOptional()
  motto: string;

  category: Category;

  @IsOptional()
  otherReachout: string;
}
