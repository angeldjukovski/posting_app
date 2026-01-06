import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserORMEntity } from 'src/user/entity/users.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { User } from './dto/users.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserORMEntity)
    private readonly userRepository: Repository<UserORMEntity>,
  ) {}

  async findByEmail(email: string): Promise<UserORMEntity | null> {
    const user = await this.userRepository.findOneBy({ email });
    return user;
  }

  async findByID(userID: number): Promise<UserORMEntity> {
    const user = await this.userRepository.findOneBy({ id: userID });
    if (!user) {
      throw new NotFoundException(`User with the id ${userID} not found`);
    }
    return user;
  }
  async findAll(): Promise<UserORMEntity[]> {
    return this.userRepository.find();
  }

  async createUser(createUserDto: CreateUserDTO): Promise<User> {
    try {
      const user = await this.userRepository.save(createUserDto);
      return user;
    } catch (error) {
      throw new BadRequestException(error, 'Error during user creation');
    }
  }

  async updateUser(
    userID: number,
    updateUserDTO: UpdateUserDTO,
  ): Promise<UserORMEntity> {
    const update = await this.userRepository.preload({
      id: userID,
      ...updateUserDTO,
    });
    if (!update) {
      throw new NotFoundException(`User with the id ${userID} not found`);
    }
    return this.userRepository.save(update);
  }

  async delete(userID: number): Promise<void> {
    const result = await this.userRepository.delete(userID);
    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${userID} not found`);
    }
  }
}
