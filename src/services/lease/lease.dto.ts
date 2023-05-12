import { ApiProperty, OmitType } from "@nestjs/swagger";
import { IsDateString, IsDecimal, IsNumber, IsOptional, IsString } from "class-validator";

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
    @IsNumber()
    apartmentId: number;

    @ApiProperty()
    @IsNumber()
    tenantId: number;
}

export class UpdateLeaseDto extends OmitType(CreateLeaseDto, ['apartmentId', 'tenantId']) { 
    @IsOptional()
    startDate: Date;
}