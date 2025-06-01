import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class VocabulariesDto {
  @ApiProperty({ description: 'The unique identifier of the vocabulary' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'The ID of the topic this vocabulary belongs to' })
  @IsString()
  topicId: string;

  @ApiProperty({ description: 'The context of the vocabulary' })
  @IsString()
  context: string;

  @ApiProperty({ description: 'The meaning of the vocabulary' })
  @IsString()
  meaning: string;

  @ApiProperty({ description: 'The phonetic transcription of the vocabulary' })
  @IsString()
  phonetic: string;

  @ApiProperty({ description: 'An example sentence using the vocabulary' })
  @IsString()
  example: string;

  @ApiProperty({ description: 'The meaning of the example sentence' })
  @IsString()
  meaningExample: string;

  @ApiProperty({ description: 'The creation date of the vocabulary' })
  @Type(() => Date)
  @IsDate()
  createdAt: Date;

  @ApiProperty({ description: 'The last update date of the vocabulary' })
  @Type(() => Date)
  @IsDate()
  updatedAt: Date;
}