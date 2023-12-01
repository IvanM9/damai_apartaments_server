import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, Length } from 'class-validator';

export class CreateTenantI {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  @IsOptional()
  lastName: string;

  @ApiProperty()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsOptional()
  @Length(10)
  phone: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsOptional()
  @Length(10, 13)
  identification: string;
}
