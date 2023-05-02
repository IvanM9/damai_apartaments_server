import { ApiProperty } from "@nestjs/swagger";

export class CreateLeaseDto{
    @ApiProperty()
    startDate: Date;
    @ApiProperty()
    endDate: Date;
    @ApiProperty()
    monthlyRent: string;
    @ApiProperty()
    description: string;
    @ApiProperty()
    apartmentId: number;
    @ApiProperty()
    tenantId: number;
}