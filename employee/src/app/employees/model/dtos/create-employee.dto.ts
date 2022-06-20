import { Expose } from 'class-transformer';
import { IsDefined, IsString, MaxLength, IsEmail, IsOptional } from 'class-validator';

export class CreateEmployeeDto {
  @IsDefined()
  @IsString()
  @MaxLength(255)
  @Expose()
  name!: string;

  @IsDefined()
  @IsString()
  @MaxLength(255)
  @Expose()
  surname!: string;

  @IsDefined()
  @IsString()
  @IsEmail()
  @MaxLength(255)
  @Expose()
  email!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Expose()
  address?: string;
}
