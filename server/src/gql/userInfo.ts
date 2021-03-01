import { gql } from 'apollo-server-express';
import dateFormat from 'dateformat';
import db from '../common/mysql';

export const userInfoTypeDefs = gql`
  type UserInfo {
    idx: Int
    userId: String
    password: String
    name: String
    nickname: String
    regdate: String
  }
  type RegistResult {
    result: Boolean
    message: String
  }
  type ModifyResult {
    result: Boolean
    message: String
  }
  type LeaveResult {
    result: Boolean
    message: String
  }
`;

export const userInfoResolvers = {
  Query: {
    login: async (root: any, { userId, password }: UserInfo) => {
      try {
        const [rows] = await db.query(`
          SELECT
            idx,
            userId,
            password,
            name,
            nickname,
            regdate
          FROM
            USERINFO
          WHERE
            USERID = '${userId}' AND
            PASSWORD = '${password}'
        `);
  
        if (rows[0]) {
          return rows[0];
        }
      } catch (err) {
        console.error(err);
      }

      return null;
    }
  },
  Mutation: {
    regist: async (root: any, { userId, password, name, nickname }: UserInfo) => {
      try {
        const [rows1] = await db.query(`
          SELECT
            COUNT(1) cnt
          FROM
            USERINFO
          WHERE
            USERID = '${userId}'
        `);

        const [rows2] = await db.query(`
          SELECT
            COUNT(1) cnt
          FROM
            USERINFO
          WHERE
            NICKNAME = '${nickname}'
        `);

        if (rows1[0].cnt > 0) {
          return {
            result: false,
            message: '중복되는 아이디가 존재합니다'
          };
        }

        if (rows2[0].cnt > 0) {
          return {
            result: false,
            message: '중복되는 닉네임이 존재합니다'
          };
        }

        await db.query(`
          INSERT INTO USERINFO(
            USERID,
            PASSWORD,
            NAME,
            NICKNAME,
            REGDATE
          ) VALUES (
            '${userId}',
            '${password}',
            '${name}',
            '${nickname}',
            '${dateFormat(new Date(), 'yyyymmddHHMMss')}'
          )
        `);

        return {
          result: true,
          message: '회원가입이 완료되었습니다'
        };
      } catch (err) {
        console.error(err);
      }

      return {
        result: false,
        message: '네트워크 에러'
      };
    },
    modify: async (root: any, { userId, password, name, nickname }: UserInfo) => {
      try {
        const [rows] = await db.query(`
          SELECT
            COUNT(1) cnt
          FROM
            USERINFO
          WHERE
            USERID <> '${userId}' AND
            NICKNAME = '${nickname}'
        `);

        if (rows[0].cnt > 0) {
          return {
            result: false,
            message: '중복되는 닉네임이 존재합니다'
          };
        }

        await db.query(`
          UPDATE
            USERINFO
          SET
            PASSWORD = '${password}',
            NAME = '${name}',
            NICKNAME = '${nickname}'
          WHERE
            USERID = '${userId}'
        `);

        return {
          result: true,
          message: '회원정보가 정상적으로 수정되었습니다'
        };
      } catch (err) {
        console.error(err);
      }

      return {
        result: false,
        message: '네트워크 에러'
      };
    },
    leave: async (root: any, { userId, password }: any) => {
      try {
        const [rows] = await db.query(`
          SELECT
            COUNT(1)
          FROM
            USERINFO
          WHERE
            USERID = '${userId}' AND
            PASSWORD = '${password}'
        `);

        if (rows[0] === 0) {
          return {
            result: false,
            message: '비밀번호가 일치하지 않습니다'
          };
        }

        await db.query(`
          DELETE FROM
            USERINFO
          WHERE
            USERID = '${userId}'
        `);

        return {
          result: true,
          message: '회원탈퇴가 완료되었습니다'
        };
      } catch (err) {
        console.error(err);
      }

      return {
        result: false,
        messsage: '네트워크 에러'
      };
    }
  }
};