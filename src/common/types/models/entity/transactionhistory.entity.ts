import { TransactionHistoryDto } from '../dto/transactionhistory.dto';
import { ApiProperty } from '@nestjs/swagger';
import { UsersEntity } from './users.entity';

export class TransactionHistoryEntity extends TransactionHistoryDto {
  @ApiProperty({ type: () => UsersEntity })
  user: UsersEntity;
}