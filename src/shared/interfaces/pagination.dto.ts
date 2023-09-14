import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmpty, IsNumber, IsString } from 'class-validator';

export class PaginationDto {
  @ApiProperty()
  @IsNumber()
  @IsEmpty()
  page: number;

  @ApiProperty()
  @IsNumber()
  @IsEmpty()
  limit: number;

  @ApiProperty()
  @IsBoolean()
  @IsEmpty()
  status: boolean;

  @ApiProperty()
  @IsString()
  @IsEmpty()
  search: string;
}
