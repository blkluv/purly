import { LinkRepository } from '@purly/postgres';
import { Usecase } from '../../shared/base.usecase';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { AliasFactory } from '../factories/alias.factory';
import { ALIAS_FACTORY } from '../factories/alias-factory.provider';
import retry from 'async-retry';

interface ICreateLinkCommand {
  userId: string;
  name?: string;
  url: string;
}

@Injectable()
export class CreateLink implements Usecase<ICreateLinkCommand> {
  constructor(
    @Inject(ALIAS_FACTORY)
    private readonly aliasFactory: AliasFactory,
    private readonly linkRepository: LinkRepository
  ) {}

  private async createLink(command: ICreateLinkCommand) {
    const alias = await this.aliasFactory.create();
    const link = await this.linkRepository.create({
      alias,
      name: command.name,
      userId: command.userId,
      url: command.url,
    });

    return link;
  }

  async execute(command: ICreateLinkCommand) {
    return retry(
      async (bail) => {
        try {
          return await this.createLink(command);
        } catch (err) {
          if (this.linkRepository.isDuplicatedAliasError(err)) {
            Logger.warn('Duplicated alias detected, retrying...');
            throw err;
          }

          bail(err);
        }
      },
      {
        retries: 30,
        factor: 0,
      }
    );
  }
}
