import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { User } from './entity/user.entity';
import { CredentialsDto } from './dto/credentials.dto';

@Controller('api/v1/grac/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async register(@Body() userDto: UserDto): Promise<User> {
    return this.userService.register(userDto);
  }

  @Post('login')
  async login(@Body() credentialsDto: CredentialsDto): Promise<any> {
    return this.userService.login(credentialsDto);
  }
}
