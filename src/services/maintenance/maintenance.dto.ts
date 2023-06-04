import { ApiProperty, OmitType } from '@nestjs/swagger';
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
  @IsNumber()
  apartmentId: number;
}

export class UpdateMaintenanceDto extends OmitType(CreateMaintenanceDto, [
  'apartmentId',
]) {}
