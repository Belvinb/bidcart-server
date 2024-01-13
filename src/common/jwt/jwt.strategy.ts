import {default as config} from '../../config/keys';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JWTService } from './jwt.service';
import { PassportStrategy } from '@nestjs/passport';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly jwtService: JWTService) {
    super(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        passReqToCallback: true, 
        secretOrKey: config.jwt.secretOrKey,
      }
      
    );
  
  }

  public async validate(payload: any, req: any, done: Function) {
    const user = await this.jwtService.validateUser(req);
    if (!user) {
      return done(new UnauthorizedException(), false);
    }
    done(null, user);
  }
}