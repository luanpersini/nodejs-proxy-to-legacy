import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { InfrastructureModule } from 'src/infrastructure/infrastructure.module'
import { TestController } from './test.controller'

@Module({
  imports: [HttpModule, InfrastructureModule],
  controllers: [TestController],
  providers: []
})
export class TestModule {}
