import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { UserRoles } from '@app/common';
import * as bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.seedAdmin();
  }

  private async seedAdmin() {
      const existingAdmin = await this.userRepository.findOne({
        where: { phone: process.env.ADMIN_PHONE  }
      });

      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(
          process.env.ADMIN_PASSWORD || 'admin123', 
          10
        );

        const admin = this.userRepository.create({
          phone: process.env.ADMIN_PHONE,
          password: hashedPassword,
          role: UserRoles.ADMIN,
          inviteCode: randomUUID(),
        });

        await this.userRepository.save(admin);
    }
  }
} 