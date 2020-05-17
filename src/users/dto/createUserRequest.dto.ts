import { IsNotEmpty, IsEmail } from 'class-validator';

export class CreateUserRequstDto {
  @IsNotEmpty()
  username: string; 

  @IsNotEmpty()
  password: string;

  @IsEmail()
  email: string;
}
