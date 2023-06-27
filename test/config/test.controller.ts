import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Patch,
  Post,
  Put
} from '@nestjs/common'

@Controller('test')
export class TestController {
  private readonly fakeBody = {
    message: 'Request received successfully'
  }

  @Get()
  async getTest(): Promise<string> {
    return 'GET request received successfully'
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async postTest(): Promise<object> {
    return this.fakeBody
  }

  @Put()
  async putTest(): Promise<object> {
    return this.fakeBody
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTest(): Promise<void> {}

  @Patch()
  async patchTest(): Promise<object> {
    return this.fakeBody
  }

  //error cases
  @Get('exception')
  async throwException(): Promise<never> {
    throw new InternalServerErrorException('Unhandled Exception')
  }

  @Get('error-400')
  async error400(): Promise<string> {
    throw new BadRequestException('Error 400')
  }
}
