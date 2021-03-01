import { KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import Swal from 'sweetalert2';
import { LEAVE, MODIFY } from '../../gql';
import { RouteComponentProps, withRouter } from 'react-router';
import { Button, Form, Modal } from 'react-bootstrap';

const Contents = ({ history }: RouteComponentProps) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const _user_id = useRef<HTMLInputElement>(null);
  const _password = useRef<HTMLInputElement>(null);
  const _confirm_password = useRef<HTMLInputElement>(null);
  const _name = useRef<HTMLInputElement>(null);
  const _nickname = useRef<HTMLInputElement>(null);
  const _current_password = useRef<HTMLInputElement>(null);

  const [sendRegistData, { data: registResult }] = useMutation(MODIFY);
  const [sendLeaveData, { data: leaveResult }] = useMutation(LEAVE);

  const modify = useCallback(() => {
    const userId = _user_id.current?.value;
    const password = _password.current?.value;
    const confirmPassword = _confirm_password.current?.value;
    const name = _name.current?.value;
    const nickname = _nickname.current?.value;

    if (userId === '') {
      Swal.fire({
        icon: 'error',
        title: '회원정보 수정',
        text: '아이디를 입력해주세요',
        didOpen: () => document.body.removeAttribute('class'),
        didClose: () => _user_id.current?.focus()
      });
      return;
    }

    if (password === '') {
      Swal.fire({
        icon: 'error',
        title: '회원정보 수정',
        text: '비밀번호를 입력해주세요',
        didOpen: () => document.body.removeAttribute('class'),
        didClose: () => _password.current?.focus()
      });
      return;
    }

    if (confirmPassword === '') {
      Swal.fire({
        icon: 'error',
        title: '회원정보 수정',
        text: '비밀번호를 확인해주세요',
        didOpen: () => document.body.removeAttribute('class'),
        didClose: () => _confirm_password.current?.focus()
      });
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: '회원정보 수정',
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
        title: '회원정보 수정',
        text: '이름을 입력해주세요',
        didOpen: () => document.body.removeAttribute('class'),
        didClose: () => _name.current?.focus()
      });
      return;
    }

    if (nickname === '') {
      Swal.fire({
        icon: 'error',
        title: '회원정보 수정',
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

  const leave = useCallback(() => {
    sendLeaveData({
      variables: {
        userId: _user_id.current?.value,
        password: _current_password.current?.value
      }
    });
  }, [_user_id, _current_password, sendLeaveData]);

  const pressEnter = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13) {
      modify();
    }
  }, [modify]);

  useEffect(() => {
    if (registResult !== undefined) {
      Swal.fire({
        icon: registResult?.modify.result ? 'success' : 'error',
        title: '회원정보 수정',
        text: registResult?.modify.message,
        didOpen: () => {
          if (registResult?.modify.result) {
            if (
              _user_id.current?.value &&
              _password.current?.value &&
              _name.current?.value &&
              _nickname.current?.value
            ) {
              sessionStorage.setItem('userInfo', JSON.stringify({
                userId: _user_id.current.value,
                password: _password.current.value,
                name: _name.current.value,
                nickname: _nickname.current.value
              }));
            }
          }
          document.body.removeAttribute('class');
        },
        didClose: () => {
          if (registResult?.modify.result) {
            history.push('/');
          }
        }
      });
    }
  }, [registResult, history]);

  useEffect(() => {
    if (leaveResult !== undefined) {
      Swal.fire({
        icon: leaveResult?.leave.result ? 'success' : 'error',
        title: '회원탈퇴',
        text: leaveResult?.leave.message,
        didOpen: () => {
          if (leaveResult?.leave.result) {
            sessionStorage.clear();
          }
          document.body.removeAttribute('class')
        },
        didClose: () => history.push('/')
      });
    }
  }, [leaveResult, history]);

  useEffect(() => {
    const tmp = sessionStorage.getItem('userInfo');
    if (!tmp) {
      history.push('/');
      return;
    }

    const userInfo = JSON.parse(tmp);

    if (
      !_user_id.current ||
      !_name.current ||
      !_nickname.current
    ) return;

    _user_id.current.value = userInfo.userId;
    _name.current.value = userInfo.name;
    _nickname.current.value = userInfo.nickname;
  }, [history]);

  return (
    <>
      <div className='login-container'>
        <div className='login-wrapper'>
          <h2>회원정보 수정</h2>

          <Form.Group>
            <Form.Label>ID</Form.Label>
            <Form.Control
              ref={_user_id}
              onKeyUp={pressEnter}
              disabled
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
                display: 'block',
                width: '100%',
                margin: '20px 0'
              }}
              onClick={modify}
            >
              MODIFY
            </Button>

            <hr/>

            <Button
              variant='danger'
              style={{
                display: 'block',
                width: '100%',
                margin: '20px 0 0 0'
              }}
              onClick={() => setShowModal(true)}
            >
              LEAVE
            </Button>
          </Form.Group>
        </div>
      </div>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>회원탈퇴</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <h4>비밀번호</h4>
          <Form.Control
            ref={_current_password}
            type='password'
            //onKeyUp={pressEnter}
          />
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>취소</Button>
          <Button variant="danger" onClick={leave}>탈퇴</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default withRouter(Contents);