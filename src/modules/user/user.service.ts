import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { AuthHelper } from '../../common/helpers/auth.helper';
import { UserDto } from './dto/user.dto';
import { User } from './entity/user.entity';
import { UserRepository } from './user.repository';
import { CredentialsDto } from './dto/credentials.dto';
import { IToken } from './interface/token.interface';
import { IPayload } from './interface/payload.interface';

@Injectable()
export class UserService {
  private logger = new Logger('UserService');

  constructor(
    private userRepository: UserRepository,
    private authHelper: AuthHelper,
  ) {}

  // user validation
  async login(credentialsDto: CredentialsDto): Promise<any> {
    const user = await this.userRepository.findOne({
      name: credentialsDto.name,
    });

    // validate password
    const isMatch = await this.authHelper.hashAndMatchPassword(
      user.password,
      credentialsDto.password,
    );

    // if user exist and password match
    if (user && isMatch) {
      const token: IToken = await this.authHelper.generateToken(user);
      this.logger.verbose(`user ${user.name} logged in!`);
      return token;
    }

    return null;
  }

  // register new user
  async register(userDto: UserDto): Promise<User> {
    const { name, age, password, password2 } = userDto;
    const newUser = new User();

    // check passwords
    if (password !== password2) {
      this.logger.error('passwords dont match');
      throw new ConflictException('passwords dont match');
    }

    // new user instance
    newUser.name = name;
    newUser.age = age;
    newUser.password = password;

    try {
      await this.userRepository.save(newUser);
      this.logger.verbose(`new user "${name}" successfully registered!`);

      delete newUser.password;
      return newUser;
    } catch (err) {
      // if user or email already in use
      if (err.code === '23505') {
        this.logger.error(`username or email already exists - ${err.message}`);
        throw new ConflictException(
          `username or email already exists - ${err.message}`,
        );
      }

      // register fail
      this.logger.error(`failed to register user - ${err.message}`);
      throw new InternalServerErrorException(
        `failed to register user - ${err.message}`,
      );
    }
  }

  // jwt-strategy validation
  async jwtValidation(payload: IPayload): Promise<User> {
    return await this.userRepository.findOne(payload.id);
  }
}
