import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class TopicsDto {
  @ApiProperty({ description: 'The unique identifier of the topic' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'The name of the topic' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'The description of the topic', required: false })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiProperty({ description: 'The creation date of the topic' })
  @Type(() => Date)
  @IsDate()
  createdAt: Date;

  @ApiProperty({ description: 'The last update date of the topic' })
  @Type(() => Date)
  @IsDate()
  updatedAt: Date;

  @ApiProperty({
    description: 'The ID of the user who owns this topic, if any',
    required: false,
  })
  @IsOptional()
  @IsString()
  usersId?: string | null;

  @ApiProperty({
    description: 'The ID of the metadata user associated with this topic',
  })
  @IsString()
  metaDataUserId: string;
}
