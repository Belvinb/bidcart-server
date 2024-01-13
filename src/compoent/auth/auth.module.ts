import { HttpModule, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/common/schema/user.schema';
import { EmailVerificationSchema } from 'src/common/schema/emailverification.schema';
import { ForgottenPasswordSchema } from 'src/common/schema/forgottenpassword.schema';
import { UserService } from '../user/user.service';
import { JWTService } from '../../common/jwt/jwt.service';
import { JwtStrategy } from 'src/common/jwt/jwt.strategy';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'User', schema: UserSchema },
    { name: 'EmailVerification', schema: EmailVerificationSchema },
    { name: 'ForgottenPassword', schema: ForgottenPasswordSchema },
    
  ]), HttpModule],
  providers: [AuthService,UserService, JWTService, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
