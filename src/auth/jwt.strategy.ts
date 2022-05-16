import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Account } from './account.entity';
import { AccountRepository } from './account.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(AccountRepository)
    private accountRepository: AccountRepository,
  ) {
    super({
      secretOrKey: 'SECRET12345',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload) {
    const { username } = payload;
    const account: Account = await this.accountRepository.findOne({ username });

    if (!account) {
      throw new UnauthorizedException();
    }

    return account;
  }
}
