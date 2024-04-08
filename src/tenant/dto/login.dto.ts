import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class TenantCredentialsDto {
  @IsString()
  @MinLength(5)
  @MaxLength(15)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  // Regex to ensure password contains at least 1 upper case, 1 lower case letter, 1 number or special character.
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must have contain upper case, lower case, number and special characters.',
  })
  password: string;
}
