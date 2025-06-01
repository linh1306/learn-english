import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsEnum } from 'class-validator';
import { TypeLevel } from '@prisma/client';

export class MetaDataUsersDto {
  @ApiProperty({ description: 'The user ID associated with the metadata' })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'The ID of the associated topic, if any',
    required: false,
  })
  @IsOptional()
  @IsString()
  topicsId?: string | null;

  @ApiProperty({
    description: 'The Facebook ID of the user, if any',
    required: false,
  })
  @IsOptional()
  @IsString()
  facebookId?: string | null;

  @ApiProperty({ description: 'The current topic of the user' })
  @IsString()
  currentTopic: string;

  @ApiProperty({ description: 'The profile of the user' })
  @IsString()
  profile: string;

  @ApiProperty({ description: 'The level of the user', default: 150 })
  @IsInt()
  level: number;

  @ApiProperty({
    enum: TypeLevel,
    description: 'The type of level',
    default: TypeLevel.toeic,
  })
  @IsEnum(TypeLevel)
  typeLevel: TypeLevel;
}
