import { useLazyQuery } from '@apollo/react-hooks';
import { KeyboardEvent, useCallback, useEffect, useRef } from 'react';
import { Button, Form } from 'react-bootstrap';
import { RouteComponentProps, withRouter } from 'react-router';
import Swal from 'sweetalert2';
import { LOGIN } from '../../gql';

const Contents = ({ history }: RouteComponentProps) => {
  const [getUserInfo, { loading, data }] = useLazyQuery(LOGIN);

  const _user_id = useRef<HTMLInputElement>(null);
  const _password = useRef<HTMLInputElement>(null);

  const login = useCallback(() => {
    const inputUserId = _user_id.current?.value;
    const inputPassword = _password.current?.value;

    if (inputUserId === '') {
      Swal.fire({
        icon: 'error',
        title: '로그인',
        text: '아이디를 입력해주세요',
        didOpen: () => document.body.removeAttribute('class'),
        didClose: () => _user_id.current?.focus()
      });
      return;
    }

    if (inputPassword === '') {
      Swal.fire({
        icon: 'error',
        title: '로그인',
        text: '비밀번호를 입력해주세요',
        didOpen: () => document.body.removeAttribute('class'),
        didClose: () => _password.current?.focus()
      });
      return;
    }

    getUserInfo({
      variables: {
        userId: _user_id.current?.value,
        password: _password.current?.value
      }
    });
  }, [_user_id, _password, getUserInfo]);

  const pressEnter = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13) {
      login();
    }
  }, [login]);

  useEffect(() => {
    if (data) {
      if (data.login) {
        sessionStorage.setItem('userInfo', JSON.stringify(data.login));
        history.push('/');
        return;
      }
    }
    
    if (data !== undefined) {
      Swal.fire({
        icon: 'error',
        title: '로그인',
        text: '아이디와 비밀번호를 확인해주세요',
        didOpen: () => document.body.removeAttribute('class'),
        didClose: () => {
          if (!_user_id.current || !_password.current) return;
          _user_id.current.value = '';
          _password.current.value = '';
          _user_id.current?.focus();
        }
      });
    }
  }, [data, history]);

  if (loading) return <></>;

  return (
    <div className='login-container'>
      <div className='login-wrapper'>
        <h2>로그인</h2>

        <Form.Group>
          <Form.Label>ID</Form.Label>
          <Form.Control
            ref={_user_id}
            onKeyUp={pressEnter}
          />

          <Form.Label style={{ marginTop: '10px' }}>PASSWORD</Form.Label>
          <Form.Control
            ref={_password}
            type='password'
            onKeyUp={pressEnter}
          />

          <Button
            style={{
              width: '100%',
              margin: '20px 0 0 0'
            }}
            onClick={login}
          >
            LOGIN
          </Button>
        </Form.Group>
      </div>
    </div>
  );
};

export default withRouter(Contents);