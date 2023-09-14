import { ApiProperty } from '@nestjs/swagger';

export class CreateMethodPaymentDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  bankId: number;
}
