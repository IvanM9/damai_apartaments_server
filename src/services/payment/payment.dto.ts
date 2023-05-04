import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsDecimal, IsNotEmpty, IsNumber } from "class-validator";

export class CreatePaymentDto{
    @ApiProperty({type:'decimal', format: 'decimal', example: '"100.00"'})
    @IsDecimal()
    amount: string;

    @ApiProperty()
    @IsDateString()
    date: Date;

    @ApiProperty()
    @IsNumber()
    leaseId: number;

    @ApiProperty()
    @IsNumber()
    methodPaymentId: number;
}