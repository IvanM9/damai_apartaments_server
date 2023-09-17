import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CreateMethodPaymentDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  @IsOptional()
  description: string;
  @ApiProperty()
  bankId: number;
}
