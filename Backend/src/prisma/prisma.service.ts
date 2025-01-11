import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    Logger.log('Database Connected SuccessFully!!!');
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
