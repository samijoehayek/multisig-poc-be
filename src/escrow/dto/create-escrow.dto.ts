import { IsHexadecimal, IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateEscrowDto {
  @IsNotEmpty()
  ledgerXpub!: string;

  @IsHexadecimal()
  @IsNotEmpty()
  ledgerXfp!: string; // 8 hex chars recommended

  @IsNotEmpty()
  coldcardXpub!: string;

  @IsHexadecimal()
  @IsNotEmpty()
  coldcardXfp!: string;

  @IsNotEmpty()
  index!: string;

  // optional: allow caller to set wallet name
  // @IsNotEmpty()
  // walletName?: string;
}
