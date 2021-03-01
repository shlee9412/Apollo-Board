import { useEffect } from 'react';
import Header from '../components/common/Header';
import Contents from '../components/Login/Contents';

const Login = () => {
  useEffect(() => {
    sessionStorage.clear();
  }, []);

  return (
    <div className='page-container'>
      <Header/>
      <Contents/>
    </div>
  );
};

export default Login;