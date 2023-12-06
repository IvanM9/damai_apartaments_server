import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  IsDateString,
  IsDecimal,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateLeaseDto {
  @ApiProperty()
  @IsDateString({ strict: true })
  startDate: Date;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  endDate: Date;

  @ApiProperty()
  @IsDecimal({ decimal_digits: '1,2' })
  monthlyRent: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsNumberString()
  apartmentId: number;

  @ApiProperty()
  @IsNumber()
  tenantId: number;
}

export class UpdateLeaseDto extends PickType(CreateLeaseDto, [
  'description',
  'endDate',
]) {
  @ApiProperty()
  @IsOptional()
  @IsDateString({ strict: true })
  startDate: Date;

  @ApiProperty()
  @IsDecimal({ decimal_digits: '1,2' })
  @IsOptional()
  monthlyRent: string;
}
