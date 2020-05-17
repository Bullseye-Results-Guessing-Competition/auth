import { Controller, Request, Post, Get, UseGuards, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserRequstDto } from 'src/users/dto/createUserRequest.dto';
import { CreateUserResponseDto } from 'src/users/dto/createUserResponse.dto';
import { TokenInfoRequestDto } from './dto/tokenInfoRequest.dto';
import { LoginResponseDto } from './dto/loginResponse.dto';
import { UserValidateDto } from './dto/userValidate.dto';

@Controller('/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('/register')
  async register(
    @Body() createUserRequstDto: CreateUserRequstDto,
  ): Promise<CreateUserResponseDto> {
    return this.usersService.create(createUserRequstDto);

  }

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Request() req) : Promise<LoginResponseDto> {    
    return this.authService.login(req.user);
  }

  @Post('/token_info')
  async tokenInfo(@Body() tokenInfoRequestDto : TokenInfoRequestDto) : Promise<UserValidateDto> {
    return this.authService.tokenInfo(tokenInfoRequestDto);
  }
}
