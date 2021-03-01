import { gql } from 'apollo-boost';

export const LOGIN = gql`
query($userId: String, $password: String) {
  login(
    userId: $userId
    password: $password
  ) {
    userId
    password
    name
    nickname
  }
}
`;

export const REGIST = gql`
mutation(
  $userId: String
  $password: String
  $name: String
  $nickname: String
) {
  regist(
    userId :$userId
    password :$password
    name :$name
    nickname :$nickname
  ) {
    result
    message
  }
}
`;

export const MODIFY = gql`
mutation(
  $userId: String
  $password: String
  $name: String
  $nickname: String
) {
  modify(
    userId :$userId
    password :$password
    name :$name
    nickname :$nickname
  ) {
    result
    message
  }
}
`;

export const LEAVE = gql`
mutation(
  $userId: String
  $password: String
) {
  leave(
    userId: $userId
    password: $password
  ) {
    result
    message
  }
}
`;

export const POSTS = gql`
query (
  $postIdx: Int
) {
	posts(postIdx: $postIdx) {
    nickname
    postIdx
    title
    regdate
  }
}
`;

export const ONE_POST = gql`
query (
  $postIdx: Int
) {
	posts(postIdx: $postIdx) {
    nickname
    title
    content
    regdate
  }
}
`;

export const WRITE = gql`
mutation(
  $nickname: String
  $title: String
  $content: String
) {
  write(
    nickname: $nickname
    title: $title
    content: $content
  ) {
    result
    message
  }
}
`;