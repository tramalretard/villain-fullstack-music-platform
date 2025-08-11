import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class UserDto {
  @IsNotEmpty({ message: 'Почта не может быть пустой' })
  @IsEmail()
  email: string;

  @IsOptional()
  name: string;

  @IsNotEmpty({ message: 'Пароль не может быть пустым' })
  @MinLength(8, {
    message: 'Пароль должен содержать не менее 8 символов',
  })
  password: string;
}
