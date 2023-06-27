import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { Server } from 'http'
import { AppModule } from 'src/app.module'
import { HttpExceptionFilter } from 'src/presentation/filters/httpException.filter'
import { ErrorsInterceptor } from 'src/presentation/interceptors/ErrorsInterceptor'
import { TestModule } from './test.module'

let testServer: Server
let testApp: INestApplication

export const initTestServer = async () => {
  const module = Test.createTestingModule({
    imports: [AppModule, TestModule]
  })
  const testModule = await module.compile()

  testApp = testModule.createNestApplication()
  testApp.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true
    })
  )
  testApp.useGlobalFilters(new HttpExceptionFilter())
  testApp.useGlobalInterceptors(new ErrorsInterceptor())
  await testApp.listen(8080)

  testServer = testApp.getHttpServer()

  await testApp.init()
}

export { testApp, testServer }
