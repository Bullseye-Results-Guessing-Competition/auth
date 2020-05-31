import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { UserEntity } from './user.entity';
import Utils from '../utils/utils';
import { CreateUserRequstDto } from './dto/createUserRequest.dto';
import { UpdateUserRequstDto } from './dto/updateUserRequest.dto';
import { genSalt, hash } from 'bcryptjs';
import { UserRole } from './user-role.enum';
import { CreateUserResponseDto } from './dto/createUserResponse.dto';
import { UpdateUserResponseDto } from './dto/updateUserResponse.dto';
import { DeleteUserResponseDto } from './dto/deleteUserResponse.dto';
import { GetUserResponseDto } from './dto/getUserResponse.dto';
import { UsersRepoistory } from './users.repoistory';

@Injectable()
export class UsersService {
  constructor(
    @Inject(UsersRepoistory)
    private usersRepository: UsersRepoistory,
  ) {}

  async getAllUsers(): Promise<GetUserResponseDto[]> {
    const users = await this.usersRepository.find();
    const getUserResponseDtoArr = [];

    users.forEach(user => {
      const getUserResponseDto = new GetUserResponseDto();
      getUserResponseDto.username = user.username;
      getUserResponseDto.email = user.email;
      getUserResponseDto.role = user.role;
      getUserResponseDtoArr.push(getUserResponseDto);
    });

    return getUserResponseDtoArr;
  }

  async create(
    createUserRequstDto: CreateUserRequstDto,
  ): Promise<CreateUserResponseDto> {
    const isUserExist = Utils.isDefined(
      await this.usersRepository.findOneByKey(
        'email',
        createUserRequstDto.email,
      ),
    ) || Utils.isDefined(
      await this.usersRepository.findOneByKey(
        'username',
        createUserRequstDto.username,
      ));
    if (isUserExist) {
      throw new ConflictException();
    }
    const newUser = new UserEntity();
    newUser.username = createUserRequstDto.username;
    newUser.email = createUserRequstDto.email;
    newUser.role = UserRole.User;

    const salt = await genSalt(10);
    newUser.password = await hash(createUserRequstDto.password, salt);

    try {
      const user = await this.usersRepository.save(newUser);
      const createUserResponseDto = new CreateUserResponseDto();
      createUserResponseDto.username = user.username;
      createUserResponseDto.email = user.email;
      return createUserResponseDto;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async getUser(id: string): Promise<GetUserResponseDto> {
    const user = await this.usersRepository.findOneByKey('id', id);
    if (user) {
      const getUserResponseDto = new GetUserResponseDto();
      getUserResponseDto.username = user.username;
      getUserResponseDto.email = user.email;
      getUserResponseDto.role = user.role;
      return getUserResponseDto;
    } else {
      throw new NotFoundException();
    }
  }

  async getUserByUsername(username: string): Promise<UserEntity> {
    const user = await this.usersRepository.findOneByKey('username', username);
    if (user) {
      return user;
    } else {
      throw new NotFoundException();
    }
  }

  async deleteUser(id: string): Promise<DeleteUserResponseDto> {
    const userEntity = await this.usersRepository.findOneByKey('id', id);
    if (!userEntity) {
      throw new NotFoundException();
    }
    try {
      await this.usersRepository.delete(id);
      const deleteUserResponseDto = new DeleteUserResponseDto();
      deleteUserResponseDto.username = userEntity.username;
      deleteUserResponseDto.email = userEntity.email;
      return deleteUserResponseDto;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async update(
    id: string,
    updateUserRequstDto: UpdateUserRequstDto,
  ): Promise<UpdateUserResponseDto> {
    const user = await this.usersRepository.findOneByKey('id', id);
    const updatedUser = user;
    if (!user) {
      throw new NotFoundException();
    }
    if (updateUserRequstDto.username) {
      updatedUser.username = updateUserRequstDto.username;
    }
    if (updateUserRequstDto.email) {
      updatedUser.email = updateUserRequstDto.email;
    }
    if (updateUserRequstDto.password) {
      updatedUser.password = updateUserRequstDto.password;
    }
    try {
      await this.usersRepository.update(id, updatedUser);
      const updateUserResponseDto = new UpdateUserResponseDto();
      updateUserResponseDto.username = updatedUser.username;
      updateUserResponseDto.email = updatedUser.email;
      return updateUserResponseDto;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }
}
