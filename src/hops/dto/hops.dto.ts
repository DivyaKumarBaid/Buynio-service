import { IsNotEmpty, IsOptional } from "class-validator";
import { Category } from "src/lib/enums";

export class brandCreationDto {
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

  @IsOptional()
  instagramAccount: string;

  @IsOptional()
  facebookAccount: string;

  @IsNotEmpty()
  otherAccount: string;

  @IsNotEmpty()
  descritiption: string;

  @IsOptional()
  privacyPolicy: string;

  @IsOptional()
  motto: string;

  @IsNotEmpty()
  category: Category;

  @IsNotEmpty()
  link: string;
}
