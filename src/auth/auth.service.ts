import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { AccountRepository } from './account.repository';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AccountRepository)
    private accountRepository: AccountRepository,
  ) {}
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.accountRepository.createUser(authCredentialsDto);
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredentialsDto;
    const account = await this.accountRepository.findOne({ username });

    if (account && (await bcrypt.compare(password, account.password))) {
      return 'login success';
    } else {
      throw new UnauthorizedException('login failed');
    }
  }
}
