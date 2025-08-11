import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async createUser(@Body() dto: UserDto) {
    return await this.userService.createUserService(dto);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.userService.getUserByIdService(id);
  }
}
