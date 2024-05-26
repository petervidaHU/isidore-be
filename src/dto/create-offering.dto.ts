import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsUUID, IsDate } from 'class-validator';
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsFutureDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsFutureDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const currentDate = new Date();
          return value > currentDate;
        },
        defaultMessage(args: ValidationArguments) {
          return `${propertyName} must be a date in the future`;
        },
      },
    });
  };
}

export class CreateOfferingDto {
  id: string; 
  
  @IsString()
  description: string;
  
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsFutureDate()
  expiration: string;
}
