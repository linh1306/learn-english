import { ApiProperty } from '@nestjs/swagger';

export class ResMessage {
  @ApiProperty({
    type: 'string',
  })
  message: string;
}
