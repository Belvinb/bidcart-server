import { Controller, Post, HttpStatus, HttpCode, Get, Body, Param } from '@nestjs/common';
import { AuthService } from './auth.service';

import { EmailVerification } from 'src/common/interfaces/emailverification.interface';
import { ForgottenPassword } from 'src/common/interfaces/forgottenPassword.interface';
import { User } from 'src/common/interfaces/user.interface';

import { Login } from 'src/common/interfaces/login.interface';
import { ResponseError, ResponseSuccess } from 'src/common/dto/response.dto';
import { CreateUserDto } from 'src/common/dto/create-user.dto';
import { UserDto } from 'src/common/dto/user.dto';
import { IResponse } from 'src/common/interfaces/response.interface';
import { UserService } from '../user/user.service';
import { ResetPasswordDto } from 'src/common/dto/reset-password.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService ) {}

  @Post('email/login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() login: Login): Promise<IResponse> {
    try {
      var response = await this.authService.validateLogin(login.email, login.password);
      return new ResponseSuccess("LOGIN.SUCCESS", response);
    } catch(error) {
      return new ResponseError("LOGIN.ERROR", error);
    }
  }

  @Post('email/register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() createUserDto: CreateUserDto): Promise<IResponse> {
    try {
      var newUser = new UserDto(await this.userService.createNewUser(createUserDto));
      await this.authService.createEmailToken(newUser.email);
      //await this.authService.saveUserConsent(newUser.email); //[GDPR user content]
      var sent = await this.authService.sendEmailVerification(newUser.email);
      if(sent){
        return new ResponseSuccess("REGISTRATION.USER_REGISTERED_SUCCESSFULLY");
      } else {
        return new ResponseError("REGISTRATION.ERROR.MAIL_NOT_SENT");
      }
    } catch(error){
      return new ResponseError("REGISTRATION.ERROR.GENERIC_ERROR", error);
    }
  }
    
  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }
  @Get('email/verify/:token')
  public async verifyEmail(@Param() params): Promise<IResponse> {
    try {
      var isEmailVerified = await this.authService.verifyEmail(params.token);
      return new ResponseSuccess("LOGIN.EMAIL_VERIFIED", isEmailVerified);
    } catch(error) {
      return new ResponseError("LOGIN.ERROR", error);
    }
  }

  @Get('email/resend-verification/:email')
  public async sendEmailVerification(@Param() params): Promise<IResponse> {
    try {
      await this.authService.createEmailToken(params.email);
      var isEmailSent = await this.authService.sendEmailVerification(params.email);
      if(isEmailSent){
        return new ResponseSuccess("LOGIN.EMAIL_RESENT", null);
      } else {
        return new ResponseError("REGISTRATION.ERROR.MAIL_NOT_SENT");
      }
    } catch(error) {
      return new ResponseError("LOGIN.ERROR.SEND_EMAIL", error);
    }
  }

  @Get('email/forgot-password/:email')
  public async sendEmailForgotPassword(@Param() params): Promise<IResponse> {
    try {
      var isEmailSent = await this.authService.sendEmailForgotPassword(params.email);
      if(isEmailSent){
        return new ResponseSuccess("LOGIN.EMAIL_RESENT", null);
      } else {
        return new ResponseError("REGISTRATION.ERROR.MAIL_NOT_SENT");
      }
    } catch(error) {
      return new ResponseError("LOGIN.ERROR.SEND_EMAIL", error);
    }
  }

  @Post('email/reset-password')
  @HttpCode(HttpStatus.OK)
  public async setNewPassord(@Body() resetPassword: ResetPasswordDto): Promise<IResponse> {
    try {
      var isNewPasswordChanged : boolean = false;
      if(resetPassword.email && resetPassword.currentPassword){
        var isValidPassword = await this.authService.checkPassword(resetPassword.email, resetPassword.currentPassword);
        if(isValidPassword) {
          isNewPasswordChanged = await this.userService.setPassword(resetPassword.email, resetPassword.newPassword);
        } else {
          return new ResponseError("RESET_PASSWORD.WRONG_CURRENT_PASSWORD");
        }
      } else if (resetPassword.newPasswordToken) {
        var forgottenPasswordModel = await this.authService.getForgottenPasswordModel(resetPassword.newPasswordToken);
        isNewPasswordChanged = await this.userService.setPassword(forgottenPasswordModel.email, resetPassword.newPassword);
        if(isNewPasswordChanged) await forgottenPasswordModel.remove();
      } else {
        return new ResponseError("RESET_PASSWORD.CHANGE_PASSWORD_ERROR");
      }
      return new ResponseSuccess("RESET_PASSWORD.PASSWORD_CHANGED", isNewPasswordChanged);
    } catch(error) {
      return new ResponseError("RESET_PASSWORD.CHANGE_PASSWORD_ERROR", error);
    }
  }

}