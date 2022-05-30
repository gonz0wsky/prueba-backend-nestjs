import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { print } from 'graphql';
import { SignUp } from 'src/schema-nodes';
import { AppModule } from 'src/app.module';

describe('App e2e', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);

    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    app.close();
  });

  const userOne = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'jhondoe@gmail.com',
    password: '123456',
  };

  describe('Authentication', () => {
    describe('SignUp', () => {
      it('Should throw if email empty', () => {
        return pactum
          .spec()
          .post('/graphql')
          .withGraphQLQuery(print(SignUp))
          .withGraphQLVariables({
            input: {
              firstName: userOne.firstName,
              lastName: userOne.lastName,
              password: userOne.password,
            },
          })
          .expectStatus(400);
      });

      it('Should throw if password empty', () => {
        return pactum
          .spec()
          .post('/graphql')
          .withGraphQLQuery(print(SignUp))
          .withGraphQLVariables({
            input: {
              firstName: userOne.firstName,
              lastName: userOne.lastName,
              email: userOne.email,
            },
          })
          .expectStatus(400);
      });

      it('Should throw if firstName empty', () => {
        return pactum
          .spec()
          .post('/graphql')
          .withGraphQLQuery(print(SignUp))
          .withGraphQLVariables({
            input: {
              lastName: userOne.lastName,
              email: userOne.email,
              password: userOne.password,
            },
          })
          .expectStatus(400);
      });

      it(`Should create new user: ${userOne.firstName} ${userOne.lastName}`, () => {
        return pactum
          .spec()
          .post('/graphql')
          .withGraphQLQuery(print(SignUp))
          .withGraphQLVariables({
            input: {
              firstName: userOne.firstName,
              lastName: userOne.lastName,
              email: userOne.email,
              password: userOne.password,
            },
          })
          .inspect();
      });
    });
  });
});
