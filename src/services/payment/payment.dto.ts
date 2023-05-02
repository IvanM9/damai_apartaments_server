import { ApiProperty } from "@nestjs/swagger";

export class CreatePaymentDto{
    @ApiProperty()
    amount: string;
    @ApiProperty()
    date: Date;
    @ApiProperty()
    leaseId: number;
    @ApiProperty()
    methodPaymentId: number;
}