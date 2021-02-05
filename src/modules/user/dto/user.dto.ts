import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  @MinLength(4)
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  age: number;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
  password2: string;
}
