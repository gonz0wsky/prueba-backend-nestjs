import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { print } from 'graphql';
import {
  ChangePassword,
  CreateIdea,
  DeleteIdea,
  ListIdeas,
  Me,
  RequestResetPassword,
  ResetPassword,
  SignIn,
  SignUp,
  UpdateIdea,
} from 'src/schema-nodes';
import { AppModule } from 'src/app.module';
import { BAD_USER_INPUT } from './commonResponses';

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
          .expectJsonLike(BAD_USER_INPUT);
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
          .expectJsonLike(BAD_USER_INPUT);
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
          .expectJsonLike(BAD_USER_INPUT);
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

    describe('Change password', () => {
      it(`Should throw if currentPassword is empty`, () => {
        return pactum
          .spec()
          .post('/graphql')
          .withHeaders({
            Authorization: 'Bearer $S{userOneToken}',
          })
          .withGraphQLQuery(print(ChangePassword))
          .withGraphQLVariables({
            input: {
              newPassword: userOne.password,
            },
          })
          .expectJsonLike(BAD_USER_INPUT);
      });

      it(`Should throw if newPassrod is empty`, () => {
        return pactum
          .spec()
          .post('/graphql')
          .withHeaders({
            Authorization: 'Bearer $S{userOneToken}',
          })
          .withGraphQLQuery(print(ChangePassword))
          .withGraphQLVariables({
            input: {
              newPassword: userOne.password,
            },
          })
          .expectJsonLike(BAD_USER_INPUT);
      });

      it(`Should fail if wrong password ${userOne.firstName} ${userOne.lastName} user`, () => {
        return pactum
          .spec()
          .post('/graphql')
          .withHeaders({
            Authorization: 'Bearer $S{userOneToken}',
          })
          .withGraphQLQuery(print(ChangePassword))
          .withGraphQLVariables({
            input: {
              currentPassword: 'bad_password',
              newPassword: userOne.password,
            },
          })
          .expectJsonLike({
            errors: [
              {
                message: 'Invalid credentials',
              },
            ],
          });
      });

      it(`Change password to ${userOne.firstName} ${userOne.lastName} user`, () => {
        return pactum
          .spec()
          .post('/graphql')
          .withHeaders({
            Authorization: 'Bearer $S{userOneToken}',
          })
          .withGraphQLQuery(print(ChangePassword))
          .withGraphQLVariables({
            input: {
              currentPassword: userOne.password,
              newPassword: userOne.password,
            },
          })
          .expectJsonLike({
            data: {
              changePassword: true,
            },
          });
      });
    });

    describe('Reset password', () => {
      it(`Should throw if email is empty`, () => {
        return pactum
          .spec()
          .post('/graphql')
          .withGraphQLQuery(print(RequestResetPassword))
          .withGraphQLVariables({
            input: {},
          })
          .expectJsonLike(BAD_USER_INPUT);
      });

      it(`Request reset password ${userOne.firstName} ${userOne.lastName} user`, () => {
        return pactum
          .spec()
          .post('/graphql')
          .withGraphQLQuery(print(RequestResetPassword))
          .withGraphQLVariables({
            input: {
              email: userOne.email,
            },
          })
          .expectJsonLike({
            data: {
              requestResetPassword: "typeof $V === 'string'",
            },
          })
          .stores('userOneResetPasswordToken', 'data.requestResetPassword');
      });

      it(`Should throw if token is empty`, () => {
        return pactum
          .spec()
          .post('/graphql')
          .withGraphQLQuery(print(ResetPassword))
          .withGraphQLVariables({
            input: {
              password: userOne.password,
            },
          })
          .expectJsonLike(BAD_USER_INPUT);
      });

      it(`Should throw if password is empty`, () => {
        return pactum
          .spec()
          .post('/graphql')
          .withGraphQLQuery(print(ResetPassword))
          .withGraphQLVariables({
            input: {
              token: '$S{userOneResetPasswordToken}',
            },
          })
          .expectJsonLike(BAD_USER_INPUT);
      });

      it(`Reset password ${userOne.firstName} ${userOne.lastName} user`, () => {
        return pactum
          .spec()
          .post('/graphql')
          .withGraphQLQuery(print(ResetPassword))
          .withGraphQLVariables({
            input: {
              token: '$S{userOneResetPasswordToken}',
              password: userOne.password,
            },
          })
          .expectJsonLike({
            data: {
              resetPassword: true,
            },
          });
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

  describe('Idea', () => {
    describe('Create', () => {
      it(`Should throw if empty content`, () => {
        return pactum
          .spec()
          .post('/graphql')
          .withHeaders({
            Authorization: 'Bearer $S{userOneToken}',
          })
          .withGraphQLQuery(print(CreateIdea))
          .withGraphQLVariables({
            input: {
              visibility: 'PUBLIC',
            },
          })
          .expectJsonLike(BAD_USER_INPUT);
      });

      it(`Should throw if empty visibility`, () => {
        return pactum
          .spec()
          .post('/graphql')
          .withHeaders({
            Authorization: 'Bearer $S{userOneToken}',
          })
          .withGraphQLQuery(print(CreateIdea))
          .withGraphQLVariables({
            input: {
              content: "I'm an idea",
            },
          })
          .expectJsonLike(BAD_USER_INPUT);
      });

      it(`Should throw if not valid visibility value`, () => {
        return pactum
          .spec()
          .post('/graphql')
          .withHeaders({
            Authorization: 'Bearer $S{userOneToken}',
          })
          .withGraphQLQuery(print(CreateIdea))
          .withGraphQLVariables({
            input: {
              content: "I'm an idea",
              visibility: 'PUBLIC_PRIVATE',
            },
          })
          .expectJsonLike(BAD_USER_INPUT);
      });

      it(`Create an idea with ${userOne.firstName} ${userOne.lastName} user`, () => {
        return pactum
          .spec()
          .post('/graphql')
          .withHeaders({
            Authorization: 'Bearer $S{userOneToken}',
          })
          .withGraphQLQuery(print(CreateIdea))
          .withGraphQLVariables({
            input: {
              content: "I'm an idea",
              visibility: 'PUBLIC',
            },
          })
          .expectJsonLike({
            data: {
              createIdea: {
                content: "I'm an idea",
                visibility: 'PUBLIC',
              },
            },
          })
          .stores('ideaOneId', 'data.createIdea.id');
      });

      it(`Create an idea with ${userTwo.firstName} ${userTwo.lastName} user`, () => {
        return pactum
          .spec()
          .post('/graphql')
          .withHeaders({
            Authorization: 'Bearer $S{userTwoToken}',
          })
          .withGraphQLQuery(print(CreateIdea))
          .withGraphQLVariables({
            input: {
              content: "I'm an idea 2",
              visibility: 'PROTECTED',
            },
          })
          .expectJsonLike({
            data: {
              createIdea: {
                content: "I'm an idea 2",
                visibility: 'PROTECTED',
              },
            },
          })
          .stores('ideaTwoId', 'data.createIdea.id');
      });

      it(`Create an idea with ${userThree.firstName} ${userThree.lastName} user`, () => {
        return pactum
          .spec()
          .post('/graphql')
          .withHeaders({
            Authorization: 'Bearer $S{userThreeToken}',
          })
          .withGraphQLQuery(print(CreateIdea))
          .withGraphQLVariables({
            input: {
              content: "I'm an idea 3",
              visibility: 'PRIVATE',
            },
          })
          .expectJsonLike({
            data: {
              createIdea: {
                content: "I'm an idea 3",
                visibility: 'PRIVATE',
              },
            },
          })
          .stores('ideaThreeId', 'data.createIdea.id');
      });
    });

    describe('Update', () => {
      it(`Should throw if id is empty`, () => {
        return pactum
          .spec()
          .post('/graphql')
          .withHeaders({
            Authorization: 'Bearer $S{userOneToken}',
          })
          .withGraphQLQuery(print(UpdateIdea))
          .withGraphQLVariables({
            input: {
              content: "I'm an idea 1",
              visibility: 'PROTECTED',
            },
          })
          .expectJsonLike(BAD_USER_INPUT);
      });

      it(`Should throw if not valid visibility`, () => {
        return pactum
          .spec()
          .post('/graphql')
          .withHeaders({
            Authorization: 'Bearer $S{userOneToken}',
          })
          .withGraphQLQuery(print(UpdateIdea))
          .withGraphQLVariables({
            input: {
              id: '$S{ideaOneId}',
              visibility: 'PROTECTED_PUBLIC',
            },
          })
          .expectJsonLike(BAD_USER_INPUT);
      });

      it(`Update idea from ${userOne.firstName} ${userOne.lastName} user`, () => {
        return pactum
          .spec()
          .post('/graphql')
          .withHeaders({
            Authorization: 'Bearer $S{userOneToken}',
          })
          .withGraphQLQuery(print(UpdateIdea))
          .withGraphQLVariables({
            input: {
              id: '$S{ideaOneId}',
              content: "I'm an idea 1",
              visibility: 'PROTECTED',
            },
          })
          .expectJsonLike({
            data: {
              updateIdea: {
                content: "I'm an idea 1",
                visibility: 'PROTECTED',
              },
            },
          });
      });

      it(`Restore idea from ${userOne.firstName} ${userOne.lastName} user to PUBLIC`, () => {
        return pactum
          .spec()
          .post('/graphql')
          .withHeaders({
            Authorization: 'Bearer $S{userOneToken}',
          })
          .withGraphQLQuery(print(UpdateIdea))
          .withGraphQLVariables({
            input: {
              id: '$S{ideaOneId}',
              visibility: 'PUBLIC',
            },
          })
          .expectJsonLike({
            data: {
              updateIdea: {
                visibility: 'PUBLIC',
              },
            },
          });
      });
    });

    describe('List', () => {
      it(`List ideas from ${userOne.firstName} ${userOne.lastName} user`, () => {
        return pactum
          .spec()
          .post('/graphql')
          .withHeaders({
            Authorization: 'Bearer $S{userOneToken}',
          })
          .withGraphQLQuery(print(ListIdeas))
          .withGraphQLVariables({
            input: {
              first: 5,
            },
          })
          .expectJsonLike({
            data: {
              listIdeas: {
                edges: [
                  {
                    node: {
                      content: "I'm an idea 1",
                    },
                  },
                ],
              },
            },
          });
      });

      it(`List ideas from ${userTwo.firstName} ${userTwo.lastName} user`, () => {
        return pactum
          .spec()
          .post('/graphql')
          .withHeaders({
            Authorization: 'Bearer $S{userTwoToken}',
          })
          .withGraphQLQuery(print(ListIdeas))
          .withGraphQLVariables({
            input: {
              first: 5,
            },
          })
          .expectJsonLike({
            data: {
              listIdeas: {
                edges: [
                  {
                    node: {
                      content: "I'm an idea 2",
                    },
                  },
                ],
              },
            },
          });
      });

      it(`List ideas from ${userThree.firstName} ${userThree.lastName} user`, () => {
        return pactum
          .spec()
          .post('/graphql')
          .withHeaders({
            Authorization: 'Bearer $S{userThreeToken}',
          })
          .withGraphQLQuery(print(ListIdeas))
          .withGraphQLVariables({
            input: {
              first: 5,
            },
          })
          .expectJsonLike({
            data: {
              listIdeas: {
                edges: [
                  {
                    node: {
                      content: "I'm an idea 3",
                    },
                  },
                ],
              },
            },
          });
      });
    });

    describe('Delete', () => {
      it(`Should throw if id is empty`, () => {
        return pactum
          .spec()
          .post('/graphql')
          .withHeaders({
            Authorization: 'Bearer $S{userOneToken}',
          })
          .withGraphQLQuery(print(DeleteIdea))
          .withGraphQLVariables({
            input: {},
          })
          .expectJsonLike(BAD_USER_INPUT);
      });

      it(`Should throw if id is not valid`, () => {
        return pactum
          .spec()
          .post('/graphql')
          .withHeaders({
            Authorization: 'Bearer $S{userOneToken}',
          })
          .withGraphQLQuery(print(DeleteIdea))
          .withGraphQLVariables({
            input: { id: 'not_valid_token' },
          })
          .expectJsonLike({
            errors: [
              {
                message: 'Idea not found',
              },
            ],
          });
      });

      it(`Delete idea from ${userOne.firstName} ${userOne.lastName} user`, () => {
        return pactum
          .spec()
          .post('/graphql')
          .withHeaders({
            Authorization: 'Bearer $S{userOneToken}',
          })
          .withGraphQLQuery(print(DeleteIdea))
          .withGraphQLVariables({
            input: { id: '$S{ideaOneId}' },
          })
          .expectJsonLike({
            data: {
              deleteIdea: true,
            },
          });
      });

      it(`Delete idea from ${userTwo.firstName} ${userTwo.lastName} user`, () => {
        return pactum
          .spec()
          .post('/graphql')
          .withHeaders({
            Authorization: 'Bearer $S{userTwoToken}',
          })
          .withGraphQLQuery(print(DeleteIdea))
          .withGraphQLVariables({
            input: { id: '$S{ideaTwoId}' },
          })
          .expectJsonLike({
            data: {
              deleteIdea: true,
            },
          });
      });

      it(`Delete idea from ${userThree.firstName} ${userThree.lastName} user`, () => {
        return pactum
          .spec()
          .post('/graphql')
          .withHeaders({
            Authorization: 'Bearer $S{userThreeToken}',
          })
          .withGraphQLQuery(print(DeleteIdea))
          .withGraphQLVariables({
            input: { id: '$S{ideaThreeId}' },
          })
          .expectJsonLike({
            data: {
              deleteIdea: true,
            },
          });
      });
    });
  });
});
