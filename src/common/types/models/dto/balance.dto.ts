import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt } from 'class-validator';

export class BalanceDto {
  @ApiProperty({ description: 'The user ID associated with this balance' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'The current balance of the user', default: 0 })
  @IsInt()
  balance: number;

  @ApiProperty({ description: 'The credit chat amount of the user', default: 0 })
  @IsInt()
  creditChat: number;
}