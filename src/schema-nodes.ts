import gql from 'graphql-tag';

export const ChangePassword = gql`
  mutation changePassword($input: ChangePasswordType!) {
    changePassword(input: $input)
  }
`;
export const CreateIdea = gql`
  mutation createIdea($input: CreateIdeaType!) {
    createIdea(input: $input) {
      authorId
      content
      createdAt
      id
      visibility
    }
  }
`;
export const DeleteIdea = gql`
  mutation deleteIdea($input: DeleteIdeaType!) {
    deleteIdea(input: $input)
  }
`;
export const RequestResetPassword = gql`
  mutation requestResetPassword($input: RequestResetPassowrdType!) {
    requestResetPassword(input: $input)
  }
`;
export const ResetPassword = gql`
  mutation resetPassword($input: ResetPasswordType!) {
    resetPassword(input: $input)
  }
`;
export const SignIn = gql`
  mutation signIn($input: SignInType!) {
    signIn(input: $input) {
      email
      firstName
      id
      lastName
      token
    }
  }
`;
export const SignUp = gql`
  mutation signUp($input: SignUpType!) {
    signUp(input: $input) {
      email
      firstName
      id
      lastName
      token
    }
  }
`;
export const UpdateIdea = gql`
  mutation updateIdea($input: UpdateIdeaType!) {
    updateIdea(input: $input) {
      authorId
      content
      createdAt
      id
      visibility
    }
  }
`;
export const ListIdeas = gql`
  query listIdeas($input: ListIdeaType!) {
    listIdeas(input: $input) {
      edges {
        cursor
        node {
          authorId
          content
          createdAt
          id
          visibility
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      totalCount
    }
  }
`;
export const Me = gql`
  query me {
    me {
      email
      firstName
      id
      lastName
      token
    }
  }
`;
