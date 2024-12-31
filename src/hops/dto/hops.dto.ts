import { IsNotEmpty, IsOptional } from "class-validator";

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
  description: string;

  @IsOptional()
  privacyPolicy: string;

  @IsOptional()
  motto: string;

  @IsNotEmpty()
  category: string;

  @IsNotEmpty()
  link: string;
}

export class savedHopCreationDto {
  @IsOptional()
  products: Product[];

  @IsOptional()
  publish: boolean;

  @IsOptional()
  blueprint: string;

  @IsOptional()
  name: string;
}

export type Product = {
  title: string;
  description: string;
  price: string;
  redirection: string;
  src: string;
  background: string;
};
