import { VocabulariesDto } from '../dto/vocabularies.dto';
import { ApiProperty } from '@nestjs/swagger';
import { TopicsEntity } from './topics.entity';

export class VocabulariesEntity extends VocabulariesDto {
  @ApiProperty({ type: () => TopicsEntity })
  topic: TopicsEntity;
}