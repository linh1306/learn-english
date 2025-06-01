import { UsersDto } from '../dto/users.dto';
import { ApiProperty } from '@nestjs/swagger';
import { MetaDataUsersEntity } from './metadatausers.entity';
import { TopicsEntity } from './topics.entity';
import { BalanceEntity } from './balance.entity';
import { TransactionHistoryEntity } from './transactionhistory.entity';

export class UsersEntity extends UsersDto {
  @ApiProperty({ type: () => MetaDataUsersEntity, required: false })
  metaData?: MetaDataUsersEntity;

  @ApiProperty({ type: () => [TopicsEntity] })
  topics: TopicsEntity[];

  @ApiProperty({ type: () => BalanceEntity, required: false })
  balance?: BalanceEntity;

  @ApiProperty({ type: () => [TransactionHistoryEntity] })
  transactionHistories: TransactionHistoryEntity[];
}
