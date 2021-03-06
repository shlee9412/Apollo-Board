import { useQuery } from '@apollo/react-hooks';
import { Redirect } from 'react-router';
import Header from '../components/common/Header';
import Contents from '../components/Modify/Contents';
import { LOGIN } from '../gql';

const Modify = () => {
  const userInfo = sessionStorage.getItem('userInfo');

  const { userId, password } = userInfo ? JSON.parse(userInfo) : { userId: null, password: null };
  const { loading, error, data } = useQuery(LOGIN, {
    variables: {
      userId,
      password
    }
  });

  if (loading) return <></>;
  if (error) return <Redirect to='/login'/>;
  if (data && !data.login) return <Redirect to='/login'/>;

  return (
    <div className='page-container'>
      <Header/>
      <Contents/>
    </div>
  );
};

export default Modify;