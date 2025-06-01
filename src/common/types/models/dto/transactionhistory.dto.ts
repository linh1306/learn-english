import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class TransactionHistoryDto {
  @ApiProperty({ description: 'The unique identifier of the transaction history entry' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'The user ID associated with this transaction' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'The amount of the transaction' })
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'The currency of the transaction', default: 'VND' })
  @IsString()
  currency: string;

  @ApiProperty({ description: 'A description of the transaction', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'The creation date of the transaction' })
  @Type(() => Date)
  @IsDate()
  createdAt: Date;
}