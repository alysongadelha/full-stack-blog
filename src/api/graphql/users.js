import { gql } from '@apollo/client/core/index.js'

export const SIGNUP_USER = gql`
  mutation signupUser($username: String!, $password: String!) {
    signupUser(username: $username, password: $password) {
      username
    }
  }
`
