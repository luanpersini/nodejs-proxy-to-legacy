import { INestApplication } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import { Test } from '@nestjs/testing'
import { AppModule } from 'src/app.module'
import * as request from 'supertest'
import { initTestServer, testApp } from './config/test.server'

const fakeBody = {
  message: 'Request received successfully'
}

describe('AppController (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleFixture.createNestApplication<NestExpressApplication>()
    await app.init()
    initTestServer()
  })

  afterAll(async () => {
    await app.close()
    testApp.close()
  })

  describe('success', () => {
    it('/proxy (GET)', async () => {
      const { body, status } = await request(app.getHttpServer()).get('/proxy/test')
      expect(body).toBe('GET request received successfully')
      expect(status).toBe(200)
    })

    it('/proxy (POST)', async () => {
      const { body, status } = await request(app.getHttpServer()).post('/proxy/test').send(fakeBody)
      expect(body).toEqual(fakeBody)
      expect(status).toBe(201)
    })

    it('/proxy (PUT)', async () => {
      const { body, status } = await request(app.getHttpServer()).put('/proxy/test').send(fakeBody)
      expect(body).toEqual(fakeBody)
      expect(status).toBe(200)
    })

    it('/proxy (PATCH)', async () => {
      const { body, status } = await request(app.getHttpServer()).patch('/proxy/test').send(fakeBody)
      expect(body).toEqual(fakeBody)
      expect(status).toBe(200)
    })

    it('/proxy (DELETE)', async () => {
      const { body, status } = await request(app.getHttpServer()).delete('/proxy/test')
      expect(status).toBe(204)
      expect(body).toEqual({})
    })
  })

  describe('error', () => {
    it('/error-400 (GET)', async () => {
      const { body, status } = await request(app.getHttpServer()).get('/proxy/test/error-400')
      expect(status).toBe(400)
      expect(body).toEqual({ message: 'Error 400', name: 'Bad Request', statusCode: 400 })
    })

    it('/exception (GET)', async () => {
      const { body, status } = await request(app.getHttpServer()).get('/proxy/test/exception')
      expect(status).toBe(500)
      expect(body.message).toBe('Unhandled Exception')
    })
  })
})
