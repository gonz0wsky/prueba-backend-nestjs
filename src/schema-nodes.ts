import gql from 'graphql-tag';

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
