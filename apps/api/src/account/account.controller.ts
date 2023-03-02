import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { User } from '../common/decorators/user.decorator';
import { mapEntity } from '../common/utils';
import { Account } from './account.schema';
import { AuthenticatedGuard } from '../auth/guards/auth.guard';
import { UpdateAccountDTO } from './dto';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OptionalAuth } from '../common/decorators/optional-auth.decorator';

@Controller('accounts')
@ApiTags('accounts')
@ApiCookieAuth()
@UseGuards(AuthenticatedGuard)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('verify')
  @OptionalAuth()
  async verifyAccount(@Body('token') token: string) {
    await this.accountService.verifyAccount(token);
  }

  @Get('me')
  @ApiOkResponse({ type: Account })
  async getProfile(@User('id') accountId: string) {
    const account = await this.accountService.findAccountById(accountId);

    return mapEntity(account, Account);
  }

  @Post('me')
  @ApiCreatedResponse({ type: Account })
  async updateProfile(
    @User('id') accountId: string,
    @Body() data: UpdateAccountDTO,
  ) {
    const account = await this.accountService.updateAccountById(
      accountId,
      data,
    );

    return mapEntity(account, Account);
  }
}
