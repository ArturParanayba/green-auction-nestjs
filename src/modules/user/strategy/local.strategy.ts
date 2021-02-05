import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User } from '../../user/entity/user.entity';
import { CredentialsDto } from '../dto/credentials.dto';
import { UserService } from '../user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private logger = new Logger('LocalStrategy');

  constructor(private userService: UserService) {
    super({
      usernameField: 'name',
      passwordField: 'password',
    });
  }

  // validation (must be called as "validate")
  async validate(name: string, password: string): Promise<User> {
    const credentialsDto: CredentialsDto = { name, password };

    try {
      const user = await this.userService.login(credentialsDto);

      if (!user) {
        throw new UnauthorizedException(
          'user not authorized or user not found',
        );
      }

      return user;
    } catch (err) {
      this.logger.error(`invalid credentials - ${err.message}`);
      throw new UnauthorizedException(`invalid credentials - ${err.message}`);
    }
  }
}
