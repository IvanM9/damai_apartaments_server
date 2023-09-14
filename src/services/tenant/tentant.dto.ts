import { ApiProperty } from '@nestjs/swagger';

export class CreateTenantI {
  @ApiProperty()
  firstname: string;

  @ApiProperty()
  lastname: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  docNumber: string;
}
