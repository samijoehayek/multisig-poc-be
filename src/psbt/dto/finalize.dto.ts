import { IsNotEmpty } from 'class-validator';

export class FinalizeDto {
  @IsNotEmpty()
  psbt!: string;
}
