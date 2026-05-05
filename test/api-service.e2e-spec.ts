import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { ApiHealthController } from '../apps/api-service/src/health/api-health.controller';
import { HealthService } from '../libs/common/src';

describe('api-service health', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ApiHealthController],
      providers: [HealthService],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/health returns readiness', async () => {
    const response = await request(app.getHttpServer()).get('/health').expect(200);

    expect(response.body).toEqual({
      service: 'api-service',
      status: 'ok',
      timestamp: expect.any(String),
    });
  });
});
