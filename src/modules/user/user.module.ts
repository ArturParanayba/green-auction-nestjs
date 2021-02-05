import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthHelper } from '../../common/helpers/auth.helper';
import { JwtModule } from '@nestjs/jwt';
import { jwtSecret, jwtExpires } from '../../config/env/env.config';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    JwtModule.register({
      secret: jwtSecret,
      signOptions: { expiresIn: jwtExpires },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, AuthHelper, LocalStrategy, JwtStrategy],
  exports: [LocalStrategy, JwtStrategy],
})
export class UserModule {}
