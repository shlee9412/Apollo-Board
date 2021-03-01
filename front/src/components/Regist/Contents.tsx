import { useMutation } from '@apollo/react-hooks';
import { KeyboardEvent, useCallback, useEffect, useRef } from 'react';
import { Button, Form } from 'react-bootstrap';
import { RouteComponentProps, withRouter } from 'react-router';
import Swal from 'sweetalert2';
import { REGIST } from '../../gql';

const Contents = ({ history }: RouteComponentProps) => {
  const _user_id = useRef<HTMLInputElement>(null);
  const _password = useRef<HTMLInputElement>(null);
  const _confirm_password = useRef<HTMLInputElement>(null);
  const _name = useRef<HTMLInputElement>(null);
  const _nickname = useRef<HTMLInputElement>(null);

  const [sendRegistData, { data }] = useMutation(REGIST);

  const regist = useCallback(() => {
    const userId = _user_id.current?.value;
    const password = _password.current?.value;
    const confirmPassword = _confirm_password.current?.value;
    const name = _name.current?.value;
    const nickname = _nickname.current?.value;

    if (userId === '') {
      Swal.fire({
        icon: 'error',
        title: '회원가입',
        text: '아이디를 입력해주세요',
        didOpen: () => document.body.removeAttribute('class'),
        didClose: () => _user_id.current?.focus()
      });
      return;
    }

    if (password === '') {
      Swal.fire({
        icon: 'error',
        title: '회원가입',
        text: '비밀번호를 입력해주세요',
        didOpen: () => document.body.removeAttribute('class'),
        didClose: () => _password.current?.focus()
      });
      return;
    }

    if (confirmPassword === '') {
      Swal.fire({
        icon: 'error',
        title: '회원가입',
        text: '비밀번호를 확인해주세요',
        didOpen: () => document.body.removeAttribute('class'),
        didClose: () => _confirm_password.current?.focus()
      });
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: '회원가입',
        text: '같은 비밀번호를 입력해 주세요',
        didOpen: () => document.body.removeAttribute('class'),
        didClose: () => {
          if (!_password.current || !_confirm_password.current) return;
          _password.current.value = '';
          _confirm_password.current.value = '';
          _password.current.focus();
        }
      });
      return;
    }

    if (name === '') {
      Swal.fire({
        icon: 'error',
        title: '회원가입',
        text: '이름을 입력해주세요',
        didOpen: () => document.body.removeAttribute('class'),
        didClose: () => _name.current?.focus()
      });
      return;
    }

    if (nickname === '') {
      Swal.fire({
        icon: 'error',
        title: '회원가입',
        text: '닉네임을 입력해주세요',
        didOpen: () => document.body.removeAttribute('class'),
        didClose: () => _nickname.current?.focus()
      });
      return;
    }

    sendRegistData({
      variables: {
        userId,
        password,
        name,
        nickname
      }
    });
  }, [_user_id, _password, _confirm_password, _name, _nickname, sendRegistData]);

  const pressEnter = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13) {
      regist();
    }
  }, [regist]);

  useEffect(() => {
    if (data !== undefined) {
      Swal.fire({
        icon: data?.regist.result ? 'success' : 'error',
        title: '회원가입',
        text: data?.regist.message,
        didOpen: () => document.body.removeAttribute('class'),
        didClose: () => {
          if (data?.regist.result) {
            history.push('/login');
          }
        }
      });
    }
  }, [data, history]);

  return (
    <div className='login-container'>
      <div className='login-wrapper'>
        <h2>회원가입</h2>

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

          <Form.Label style={{ marginTop: '10px' }}>CONFIRM PASSWORD</Form.Label>
          <Form.Control
            ref={_confirm_password}
            type='password'
            onKeyUp={pressEnter}
          />

          <Form.Label style={{ marginTop: '10px' }}>NAME</Form.Label>
          <Form.Control
            ref={_name}
            onKeyUp={pressEnter}
          />

          <Form.Label style={{ marginTop: '10px' }}>NICKNAME</Form.Label>
          <Form.Control
            ref={_nickname}
            onKeyUp={pressEnter}
          />

          <Button
            style={{
              width: '100%',
              margin: '20px 0 0 0'
            }}
            onClick={regist}
          >
            REGIST
          </Button>
        </Form.Group>
      </div>
    </div>
  );
};

export default withRouter(Contents);