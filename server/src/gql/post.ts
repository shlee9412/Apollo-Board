import { gql } from 'apollo-server-express';
import dateFormat from 'dateformat';
import db from '../common/mysql';

export const postTypeDefs = gql`
  type Post {
    nickname: String
    postIdx: Int
    title: String
    content: String
    regdate: String
  }
  type WriteResult {
    result: Boolean
    message: String
  }
`;

export const postResolvers = {
  Query: {
    posts: async (root: any, args?: any) => {
      try {
        let query = `
          SELECT
            A.nickname,
            B.idx postIdx,
            B.title,
            B.content,
            B.regdate
          FROM
            USERINFO A
          INNER JOIN
            POSTS B
          ON
            A.idx = B.userIdx
        `;
  
        if (args.postIdx) {
          query += `
            WHERE
              B.idx = ${args.postIdx}
          `;
        }

        query += `
          ORDER BY
            REGDATE
          DESC
        `;
  
        const [rows] = await db.query(query);
  
        return rows;
      } catch (err) {
        console.error(err);
      }

      return null;
    }
  },
  Mutation: {
    write: async (root: any, { nickname, title, content }: Post) => {
      try {
        await db.query(`
          INSERT INTO POSTS (
            USERIDX,
            TITLE,
            CONTENT,
            REGDATE
          ) VALUES (
            (
              SELECT
                IDX
              FROM
                USERINFO
              WHERE
                NICKNAME = '${nickname}'
            ),
            '${title}',
            '${content}',
            '${dateFormat(new Date(), 'yyyymmddHHMMss')}'
          )
        `);

        return {
          result: true,
          message: '글이 정상적으로 등록되었습니다'
        };
      } catch (err) {
        console.error(err);
      }

      return {
        result: false,
        message: '네트워크 에러'
      };
    }
  }
};