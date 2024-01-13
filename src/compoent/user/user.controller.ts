import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  Param,
} from '@nestjs/common';

import { UserService } from './user.service';
import { IResponse } from '../../common/interfaces/response.interface';

import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { LoggingInterceptor } from '../../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../../common/interceptors/transform.interceptor';
import { AuthGuard } from '@nestjs/passport';


import { UserDto } from 'src/common/dto/user.dto';
import { ResponseError, ResponseSuccess } from 'src/common/dto/response.dto';
import { UpdateGalleryDto } from 'src/common/dto/update-gallery.dto';
import { ProfileDto } from 'src/common/dto/profile.dto';
import { SettingsDto } from 'src/common/dto/settings.dto';
import { CreateUserDto } from 'src/common/dto/create-user.dto';
 
@Controller('users')
// @UseGuards(AuthGuard('jwt'))
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class UserController {
  constructor(private readonly usersService: UserService) {}


  @Get('user/:email')
  @UseGuards(RolesGuard)
  @Roles('User')
  async findById(@Param() params): Promise<IResponse>{
    try {
      var user =  await this.usersService.findByEmail(params.email);
      return new ResponseSuccess("COMMON.SUCCESS", new UserDto(user));
    } catch(error){
      return new ResponseError("COMMON.ERROR.GENERIC_ERROR", error);
    }
  }
  
  @Post('profile/update')
  @UseGuards(RolesGuard)
  @Roles('User')
  async updateProfile(@Body() profileDto: ProfileDto): Promise<IResponse> {
    try {
      var user =  await this.usersService.updateProfile(profileDto);
      return new ResponseSuccess("PROFILE.UPDATE_SUCCESS", new UserDto(user));
    } catch(error){
      return new ResponseError("PROFILE.UPDATE_ERROR", error);
    }
  }

  @Post('gallery/update')
  @UseGuards(RolesGuard)
  @Roles('User')
  async updateGallery(@Body() galleryRequest: UpdateGalleryDto): Promise<IResponse> {
    try {
      var user =  await this.usersService.updateGallery(galleryRequest);
      return new ResponseSuccess("PROFILE.UPDATE_SUCCESS", new UserDto(user));
    } catch(error){
      return new ResponseError("PROFILE.UPDATE_ERROR", error);
    }
  }

  @Post('settings/update')
  @UseGuards(RolesGuard)
  @Roles('User')
  async updateSettings(@Body() settingsDto: SettingsDto): Promise<IResponse> {
    try {
      var user =  await this.usersService.updateSettings(settingsDto);
      return new ResponseSuccess("SETTINGS.UPDATE_SUCCESS", new UserDto(user));
    } catch(error){
      return new ResponseError("SETTINGS.UPDATE_ERROR", error);
    }
  }
  @Post('email/register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() createUserDto: CreateUserDto): Promise<IResponse> {
    try {
      var newUser = new UserDto(await this.usersService.createNewUser(createUserDto));
      // await this.authService.createEmailToken(newUser.email);
      // //await this.authService.saveUserConsent(newUser.email); //[GDPR user content]
      // var sent = await this.authService.sendEmailVerification(newUser.email);
      //if(sent){
        return new ResponseSuccess("REGISTRATION.USER_REGISTERED_SUCCESSFULLY");
      // } else {
      //   return new ResponseError("REGISTRATION.ERROR.MAIL_NOT_SENT");
      // }
    } catch(error){
      return new ResponseError("REGISTRATION.ERROR.GENERIC_ERROR", error);
    }
  }
}