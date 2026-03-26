import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiPropertyOptional({ example: 'Notes for the order' })
  @IsString()
  @IsOptional()
  notes?: string;
}
