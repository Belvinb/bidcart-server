export class ProfileDto {
    constructor(object: any) {
      this.email = object.email;
      this.name = object.name;
      this.surname = object.surname;    
      this.dob = object.dob;
      this.phone = object.phone;
      this.profilePicture = object.profilePicture;
    };
    readonly email: string;
    readonly name: string;
    readonly surname: string;
    readonly dob: Date;
    readonly phone: string;
    readonly profilePicture: string;
  }