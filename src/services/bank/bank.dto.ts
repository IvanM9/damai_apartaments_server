import { ApiProperty } from '@nestjs/swagger';

export class CreateBankDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
}
