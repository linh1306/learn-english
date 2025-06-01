import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsEnum, IsDate } from 'class-validator';
import { Role } from '@prisma/client';
import { Type } from 'class-transformer';

export class UsersDto {
  @ApiProperty({ description: 'The unique identifier of the user' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'The email address of the user' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'The name of the user' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'The password of the user' })
  @IsString()
  password: string;

  @ApiProperty({ enum: Role, description: 'The role of the user', default: Role.user })
  @IsEnum(Role)
  role: Role;

  @ApiProperty({ description: 'The creation date of the user' })
  @Type(() => Date)
  @IsDate()
  createdAt: Date;
}