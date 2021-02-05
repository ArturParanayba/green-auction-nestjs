import { randomBytes } from 'crypto';
import * as argon2 from 'argon2';
import { argonSalt, jwtExpires } from '../../config';
import { User } from '../../modules/user/entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { IToken } from 'src/modules/user/interface/token.interface';
import { IPayload } from 'src/modules/user/interface/payload.interface';

@Injectable()
export class AuthHelper {
  constructor(private jwtService: JwtService) {}

  async hashPassword(password: string): Promise<any> {
    const salt = randomBytes(argonSalt);
    const hashed = await argon2.hash(password, { salt });
    return hashed;
  }

  async matchPassword(pass1: string, pass2: string): Promise<boolean> {
    if (pass1 === pass2) {
      return true;
    } else {
      return false;
    }
  }

  async hashAndMatchPassword(pass1: string, pass2: string): Promise<boolean> {
    const isMatch = await argon2.verify(pass1, pass2);
    if (isMatch) {
      return true;
    } else {
      return false;
    }
  }

  // generate tokens
  async generateToken(user: User): Promise<IToken> {
    const payload: IPayload = { id: user.id };

    const token = this.jwtService.sign(payload, {
      expiresIn: jwtExpires,
    });

    return {
      token,
    };
  }
}
