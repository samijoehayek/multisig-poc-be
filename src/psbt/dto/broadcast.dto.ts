import { IsNotEmpty } from 'class-validator';

export class BroadcastDto {
  @IsNotEmpty()
  hex!: string;
}
