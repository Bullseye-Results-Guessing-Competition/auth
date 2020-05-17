import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { TokenInfoRequestDto } from './dto/tokenInfoRequest.dto';
import { UserValidateDto } from './dto/userValidate.dto';
import { LoginResponseDto } from './dto/loginResponse.dto';

@Injectable()
export class AuthService {

  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(username: string, pass: string): Promise<UserValidateDto> {

    const user = await this.usersService.getUserByUsername(username);
    if (user && await compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login( userValidateDto: UserValidateDto) : Promise<LoginResponseDto> {
    
    return {
      access_token: this.jwtService.sign(userValidateDto),
    };
  }

  tokenInfo(tokenInfoRequestDto: TokenInfoRequestDto) : UserValidateDto  {
    try{
      const tokenVerificationResult = this.jwtService.verify(tokenInfoRequestDto.token);
      const  { id, username, email, role } = tokenVerificationResult;
      const userValidateDto = new UserValidateDto();
      userValidateDto.id = id;
      userValidateDto.username = username;
      userValidateDto.email = email;
      userValidateDto.role = role;
      return userValidateDto;
    } catch(ex){
      throw new UnauthorizedException(ex.message);
    }
    
  }

}