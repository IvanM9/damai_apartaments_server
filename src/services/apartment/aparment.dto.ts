import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CreateApartmentI {
  @ApiProperty()
  name: string;
  @ApiProperty()
  numberOfRooms: number;
  @ApiProperty()
  @IsOptional()
  monthlyRent: string;
  @IsOptional()
  @ApiProperty()
  description: string;
}
