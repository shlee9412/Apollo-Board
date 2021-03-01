import { gql } from 'apollo-server-express';

const query = gql`
  type Query {
    login(userId: String, password: String): UserInfo
    posts(postIdx: Int): [Post]
  }
  type Mutation {
    regist(userId: String, password: String, name: String, nickname: String): RegistResult
    modify(userId: String, password: String, name: String, nickname: String): ModifyResult
    leave(userId: String, password: String): LeaveResult
    write(nickname: String, title: String, content: String): WriteResult
  }
`;

export default query;