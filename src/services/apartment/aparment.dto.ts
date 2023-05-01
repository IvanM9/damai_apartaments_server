import { ApiProperty } from "@nestjs/swagger";

export class CreateApartmentI{
    @ApiProperty()
    name: string;
    @ApiProperty()
    numberOfRooms: number;
    @ApiProperty()
    monthlyRent: string;
    @ApiProperty()
    description: string;
}