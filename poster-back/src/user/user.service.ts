import { Injectable, NotFoundException } from '@nestjs/common';
import { UserORMEntity } from './entity/users.entity';
import { UpdateUserDTO } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from './entity/user-role.enum';
import { CreateUserDTO } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserORMEntity)
    private readonly userRepository: Repository<UserORMEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDTO): Promise<UserORMEntity> {
    const user = this.userRepository.save(createUserDto);
    return user;
  }

  async getUserById(userID: number): Promise<UserORMEntity> {
    const user = await this.userRepository.findOneBy({ id: userID });

    if (!user) {
      throw new NotFoundException(`User with id ${userID} not found`);
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<UserORMEntity> {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new NotFoundException(`User with the email ${email} was not found`);
    }
    return user;
  }

  async getAll(): Promise<UpdateUserDTO[]> {
    return this.userRepository.find();
  }

  async updateUser(
    userID: number,
    updateUserDto: UpdateUserDTO,
  ): Promise<UserORMEntity> {
    const user = await this.getUserById(userID);

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async updateUserRole(userID: number, role: UserRole): Promise<UserORMEntity> {
    const user = await this.getUserById(userID);
    user.role = role;
    return this.userRepository.save(user);
  }

  async deleteUser(userID: number): Promise<void> {
    await this.userRepository.delete(userID);
  }

  async changePassword(
    id: number,
    currentpassword: string,
    newpassword: string,
  ): Promise<any> {
    const user = await this.getUserById(id);

    const match = await bcrypt.compare(currentpassword, user.password);
    if (!match) {
      throw new Error('Current Password is wrong');
    }

    const hashedPassword = await bcrypt.hash(
      newpassword,
      Number(process.env.BCRYPT_SALT) || 10,
    );
    await this.userRepository.update(user.id, {
      password: hashedPassword,
    });
    return { message: 'The password is changed' };
  }
}
