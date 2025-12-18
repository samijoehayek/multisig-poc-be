import { ArrayMinSize, IsArray, IsNotEmpty } from 'class-validator';

export class CombineDto {
  @IsArray()
  @ArrayMinSize(2)
  psbts!: string[];
}
