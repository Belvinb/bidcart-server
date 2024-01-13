export class CreateUserDto {
    readonly name: string;
    readonly surname: string;
    readonly email: string;
    readonly phone: string;
    readonly dob: Date;
    password: string;
  }