import { EntityRepository, Repository } from "typeorm";
import { UserEntity } from "./user.entity";
import { BadRequestException } from "@nestjs/common";

@EntityRepository(UserEntity)
export class UsersRepoistory extends Repository<UserEntity>{

     findOneByKey(key: string, value: string): Promise<UserEntity> {
         
        try {
            return this
            .createQueryBuilder('user')
            .where('user.' + key + ' = :' + key, { [key]: value })
            .getOne();
        } catch (error) {
            throw new BadRequestException();
        }
    }

      
}