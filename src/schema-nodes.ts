import gql from 'graphql-tag';

export const AcceptFollowRequest = gql`
  mutation acceptFollowRequest($input: AcceptFollowRequestType!) {
    acceptFollowRequest(input: $input)
  }
`;
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
export const RejectFollowRequest = gql`
  mutation rejectFollowRequest($input: RejectFollowRequestType!) {
    rejectFollowRequest(input: $input)
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
export const SendFollowRequest = gql`
  mutation sendFollowRequest($input: CreateFollowRequestType!) {
    sendFollowRequest(input: $input)
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
export const ListFollowRequests = gql`
  query listFollowRequests($input: ListFollowRequestsType!) {
    listFollowRequests(input: $input) {
      edges {
        cursor
        node {
          from {
            email
            firstName
            id
            lastName
            token
          }
          fromId
          id
          to {
            email
            firstName
            id
            lastName
            token
          }
          toId
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
export const ListFollowers = gql`
  query listFollowers($input: ListFollowerType!) {
    listFollowers(input: $input) {
      edges {
        cursor
        node {
          from {
            email
            firstName
            id
            lastName
            token
          }
          fromId
          id
          to {
            email
            firstName
            id
            lastName
            token
          }
          toId
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
export const ListFollowing = gql`
  query listFollowing($input: ListFollowerType!) {
    listFollowing(input: $input) {
      edges {
        cursor
        node {
          from {
            email
            firstName
            id
            lastName
            token
          }
          fromId
          id
          to {
            email
            firstName
            id
            lastName
            token
          }
          toId
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
