import { IsNotEmpty, IsString } from 'class-validator';

export class CredentialsDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  password: string;
}
