import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtSecret } from '../../../config';
import { IPayload } from '../interface/payload.interface';
import { UserService } from '../user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private logger = new Logger('JwtStrategy');

  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  // validation
  async validate(payload: IPayload, done: Function): Promise<any> {
    const user = await this.userService.jwtValidation(payload);

    if (!user) {
      this.logger.error('invalid credentials');
      return done(new UnauthorizedException('invalid credentials'), false);
    }

    done(null, user);
  }
}
