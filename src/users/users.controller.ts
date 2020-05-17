import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserRequstDto } from './dto/updateUserRequest.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { UpdateUserResponseDto } from './dto/updateUserResponse.dto';
import { DeleteUserResponseDto } from './dto/deleteUserResponse.dto';
import { GetUserResponseDto } from './dto/getUserResponse.dto';


@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles('Admin')
  @Get()
  getUsers(): Promise<GetUserResponseDto[]> {        
    return this.usersService.getAllUsers();
  }

  @Roles('Admin')
  @Get(':id')
  getUser(@Param('id') id: string): Promise<GetUserResponseDto> {
    return this.usersService.getUser(id);
  }

  @Roles('Admin')
  @Delete(':id')
  deleteUser(@Param('id') id: string): Promise<DeleteUserResponseDto> {
    return this.usersService.deleteUser(id);
  }

  @Roles('Admin')
  @Put(':id')
  updateUser(
    @Param('id') id: string,
    @Body() updateUserRequstDto: UpdateUserRequstDto
  ): Promise<UpdateUserResponseDto> {
    return this.usersService.update(id, updateUserRequstDto);
  }
}
