import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserValidateDto } from './dto/userValidate.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<UserValidateDto> {

    const user = await this.authService.validateUser(username, password);    
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
