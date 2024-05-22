import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOfferingDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
