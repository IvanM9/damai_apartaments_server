import { ApiProperty, OmitType } from '@nestjs/swagger';
import {
  IsDateString,
  IsDecimal,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ type: 'number', format: 'decimal', example: 100.0 })
  @IsDecimal()
  amount: string;

  @ApiProperty()
  @IsDateString({ strict: true })
  date: Date;

  @ApiProperty()
  @IsString()
  leaseId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  methodPaymentId: string;
}

export class UpdatePaymentDto extends OmitType(CreatePaymentDto, ['leaseId']) {}
