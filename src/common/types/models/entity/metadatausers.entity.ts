import { MetaDataUsersDto } from '../dto/metadatausers.dto';
import { ApiProperty } from '@nestjs/swagger';
import { UsersDto } from '../dto/users.dto';
import { TopicsDto } from '../dto/topics.dto';

export class MetaDataUsersEntity extends MetaDataUsersDto {
  @ApiProperty({ type: () => UsersDto })
  user: UsersDto;

  @ApiProperty({ type: () => TopicsDto, required: false })
  topic: TopicsDto | null;
}
