import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { print } from 'graphql';
import { Me, SignIn, SignUp } from 'src/schema-nodes';
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
    firstName: 'Marty',
    lastName: 'McFly',
    email: 'martymcfly@gmail.com',
    password: '123456',
  };

  const userTwo = {
    firstName: 'Emmett',
    lastName: 'Brown',
    email: 'emmettbrown@gmail.com',
    password: 'password1234',
  };

  const userThree = {
    firstName: 'Lorraine',
    lastName: 'Baines',
    email: 'lorrainebaines@gmail.com',
    password: 'pass22222',
  };

  describe('Authentication', () => {
    describe('SignUp', () => {
      it('Should throw if email is empty', () => {
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
          .expectJsonLike({
            errors: [
              {
                extensions: {
                  code: 'BAD_USER_INPUT',
                },
              },
            ],
          });
      });

      it('Should throw if password is empty', () => {
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
          .expectJsonLike({
            errors: [
              {
                extensions: {
                  code: 'BAD_USER_INPUT',
                },
              },
            ],
          });
      });

      it('Should throw if firstName is empty', () => {
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
          .expectJsonLike({
            errors: [
              {
                extensions: {
                  code: 'BAD_USER_INPUT',
                },
              },
            ],
          });
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
          .expectJsonLike({
            data: {
              signUp: {
                email: userOne.email,
                firstName: userOne.firstName,
                lastName: userOne.lastName,
              },
            },
          });
      });

      it(`Should throw if creates again: ${userOne.firstName} ${userOne.lastName}`, () => {
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
          .expectJsonLike({
            errors: [
              {
                message: 'User already exists',
              },
            ],
          });
      });

      it(`Should create new user: ${userTwo.firstName} ${userTwo.lastName}`, () => {
        return pactum
          .spec()
          .post('/graphql')
          .withGraphQLQuery(print(SignUp))
          .withGraphQLVariables({
            input: {
              firstName: userTwo.firstName,
              lastName: userTwo.lastName,
              email: userTwo.email,
              password: userTwo.password,
            },
          })
          .expectJsonLike({
            data: {
              signUp: {
                email: userTwo.email,
                firstName: userTwo.firstName,
                lastName: userTwo.lastName,
              },
            },
          });
      });

      it(`Should create new user: ${userThree.firstName} ${userThree.lastName}`, () => {
        return pactum
          .spec()
          .post('/graphql')
          .withGraphQLQuery(print(SignUp))
          .withGraphQLVariables({
            input: {
              firstName: userThree.firstName,
              lastName: userThree.lastName,
              email: userThree.email,
              password: userThree.password,
            },
          })
          .expectJsonLike({
            data: {
              signUp: {
                email: userThree.email,
                firstName: userThree.firstName,
                lastName: userThree.lastName,
              },
            },
          });
      });
    });

    describe('SignIn', () => {
      it(`Login ${userOne.firstName} ${userOne.lastName} user`, () => {
        return pactum
          .spec()
          .post('/graphql')
          .withGraphQLQuery(print(SignIn))
          .withGraphQLVariables({
            input: {
              email: userOne.email,
              password: userOne.password,
            },
          })
          .expectJsonLike({
            data: {
              signIn: {
                email: userOne.email,
                firstName: userOne.firstName,
                lastName: userOne.lastName,
              },
            },
          })
          .stores('userOneToken', 'data.signIn.token');
      });

      it(`Login ${userTwo.firstName} ${userTwo.lastName} user`, () => {
        return pactum
          .spec()
          .post('/graphql')
          .withGraphQLQuery(print(SignIn))
          .withGraphQLVariables({
            input: {
              email: userTwo.email,
              password: userTwo.password,
            },
          })
          .expectJsonLike({
            data: {
              signIn: {
                email: userTwo.email,
                firstName: userTwo.firstName,
                lastName: userTwo.lastName,
              },
            },
          })
          .inspect()
          .stores('userTwoToken', 'data.signIn.token');
      });

      it(`Login ${userThree.firstName} ${userThree.lastName} user`, () => {
        return pactum
          .spec()
          .post('/graphql')
          .withGraphQLQuery(print(SignIn))
          .withGraphQLVariables({
            input: {
              email: userThree.email,
              password: userThree.password,
            },
          })
          .expectJsonLike({
            data: {
              signIn: {
                email: userThree.email,
                firstName: userThree.firstName,
                lastName: userThree.lastName,
              },
            },
          })
          .stores('userThreeToken', 'data.signIn.token');
      });
    });
  });

  describe('User', () => {
    describe('Me', () => {
      it(`Get ${userOne.firstName} ${userOne.lastName} user`, () => {
        return pactum
          .spec()
          .post('/graphql')
          .withHeaders({
            Authorization: 'Bearer $S{userOneToken}',
          })
          .withGraphQLQuery(print(Me))
          .expectJsonLike({
            data: {
              me: {
                email: userOne.email,
                firstName: userOne.firstName,
                lastName: userOne.lastName,
              },
            },
          });
      });

      it(`Get ${userTwo.firstName} ${userTwo.lastName} user`, () => {
        return pactum
          .spec()
          .post('/graphql')
          .withHeaders({
            Authorization: 'Bearer $S{userTwoToken}',
          })
          .withGraphQLQuery(print(Me))
          .expectJsonLike({
            data: {
              me: {
                email: userTwo.email,
                firstName: userTwo.firstName,
                lastName: userTwo.lastName,
              },
            },
          });
      });

      it(`Get ${userThree.firstName} ${userThree.lastName} user`, () => {
        return pactum
          .spec()
          .post('/graphql')
          .withHeaders({
            Authorization: 'Bearer $S{userThreeToken}',
          })
          .withGraphQLQuery(print(Me))
          .expectJsonLike({
            data: {
              me: {
                email: userThree.email,
                firstName: userThree.firstName,
                lastName: userThree.lastName,
              },
            },
          });
      });
    });
  });
});
