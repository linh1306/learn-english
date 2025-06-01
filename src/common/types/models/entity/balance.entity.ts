import { BalanceDto } from '../dto/balance.dto';
import { ApiProperty } from '@nestjs/swagger';
import { UsersEntity } from './users.entity';

export class BalanceEntity extends BalanceDto {
  @ApiProperty({ type: () => UsersEntity })
  user: UsersEntity;
}