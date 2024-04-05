import { IsNotEmpty, IsOptional } from "class-validator";
import { Category } from "src/lib/enums";

export class HopCreationDto {
  @IsNotEmpty()
  brandName: string;

  @IsNotEmpty()
  companyName: string;

  @IsNotEmpty()
  officialPhone: string;

  @IsNotEmpty()
  officialEmail: string;

  @IsOptional()
  customerServicePhone: string;

  @IsOptional()
  customerServiceEmail: string;

  @IsOptional()
  logo: string;

  @IsNotEmpty()
  instagramAccount: string;

  @IsNotEmpty()
  facebookAccount: string;

  @IsNotEmpty()
  otherAccount: string;

  @IsNotEmpty()
  descrtiption: string;

  @IsOptional()
  privacyPolicy: string;

  @IsOptional()
  motto: string;

  @IsNotEmpty()
  category: Category;

  @IsNotEmpty()
  link: string;
}
