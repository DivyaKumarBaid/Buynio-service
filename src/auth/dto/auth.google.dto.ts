import { IsNotEmpty } from "class-validator";

export class SigninThirdPartyAuthDto {
  @IsNotEmpty()
  token: string;
}
