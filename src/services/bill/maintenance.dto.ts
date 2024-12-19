import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';
import { IsDecimal, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMaintenanceDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsDecimal({ decimal_digits: '2' })
  @IsOptional()
  amount: string;

  @ApiProperty()
  @IsString()
  apartmentId: string;
}

export class UpdateMaintenanceDto extends OmitType(CreateMaintenanceDto, [
  'apartmentId',
]) {}
