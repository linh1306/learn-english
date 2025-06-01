import { TopicsDto } from '../dto/topics.dto';
import { ApiProperty } from '@nestjs/swagger';
import { VocabulariesEntity } from './vocabularies.entity';
import { UsersEntity } from './users.entity';
import { MetaDataUsersEntity } from './metadatausers.entity';

export class TopicsEntity extends TopicsDto {
  @ApiProperty({ type: () => [VocabulariesEntity] })
  vocabularies: VocabulariesEntity[];

  @ApiProperty({ type: () => UsersEntity, required: false })
  Users?: UsersEntity;

  @ApiProperty({ type: () => MetaDataUsersEntity, required: false })
  metaDataUser?: MetaDataUsersEntity;
}