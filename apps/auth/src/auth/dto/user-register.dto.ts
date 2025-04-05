import { IsNotEmpty, IsOptional, Matches } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @Matches(/^09\d{9}$/, { message: 'Phone number must start with 09 and be followed by 9 digits.' })
  phone: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  inviteCode: string;
}
