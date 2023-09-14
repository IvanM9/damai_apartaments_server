import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsDateString, IsDecimal, IsNumber } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ type: 'decimal', format: 'decimal', example: '"100.00"' })
  @IsDecimal()
  amount: number;

  @ApiProperty()
  @IsDateString({ strict: true })
  date: Date;

  @ApiProperty()
  @IsNumber()
  leaseId: number;

  @ApiProperty()
  @IsNumber()
  methodPaymentId: number;
}

export class UpdatePaymentDto extends OmitType(CreatePaymentDto, ['leaseId']) {}
