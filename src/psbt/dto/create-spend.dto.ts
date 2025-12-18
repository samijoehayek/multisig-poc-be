import { IsInt, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateSpendDto {
  @IsNotEmpty()
  walletName!: string;

  @IsNotEmpty()
  toAddress!: string;

  @IsNumber()
  @Min(0.00000001)
  amount!: number;

  @IsInt()
  @Min(1)
  feeRateSatVb!: number; // e.g. 1, 2, 5
}
