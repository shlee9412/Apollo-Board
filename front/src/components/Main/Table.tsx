import { useQuery } from '@apollo/react-hooks';
import { MDBDataTable } from 'mdbreact';
import { Redirect, RouteComponentProps, withRouter } from 'react-router';
import { POSTS } from '../../gql';
import { convertDateString } from '../../utils';

const columns = [
  {
    label: 'No',
    field: 'postIdx',
    width: 100
  },
  {
    label: '제목',
    field: 'title',
    width: 200
  },
  {
    label: '닉네임',
    field: 'nickname',
    width: 100
  },
  {
    label: '등록날짜',
    field: 'regdate',
    width: 100
  },
]

const Table = ({ history }: RouteComponentProps) => {
  const { loading, error, data: postsData } = useQuery(POSTS, {
    variables: {
      postIdx: null
    }
  });

  if (loading) return <></>;
  if (error) return <Redirect to='/'/>;

  return (
    <MDBDataTable
      striped
      bordered
      scrollX
      small
      noBottomColumns
      hover
      data={{
        columns,
        rows: postsData.posts.map((d: Post, i: number) => {
          return {
            ...d,
            postIdx: i + 1,
            regdate: convertDateString(d.regdate),
            clickEvent: () => history.push(`/post/${d.postIdx}`)
          }
        })
      }}
    />
  );
};

export default withRouter(Table);