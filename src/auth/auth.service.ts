import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { firstValueFrom } from 'rxjs';
@Injectable()
export class AuthService {
  private client: ClientProxy;
  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        host: 'localhost',
        port: 6379,
      },
    });
  }
  async validateUser(dto: LoginUserDto) {
    const result = this.client
      .send<string, LoginUserDto>('db/validate/user', dto)
      .pipe();
    const user = await firstValueFrom(result);
    return user;
  }
}
