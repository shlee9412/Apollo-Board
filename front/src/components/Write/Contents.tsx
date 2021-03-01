import { useMutation } from '@apollo/react-hooks';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Redirect } from 'react-router';
import Swal from 'sweetalert2';
import { WRITE } from '../../gql';

const Contents = () => {
  const [moveMain, setMoveMain] = useState(false);

  const [sendPostData, { data }] = useMutation(WRITE);

  const _title = useRef<HTMLInputElement>(null);
  const _content = useRef<HTMLTextAreaElement>(null);

  const write = useCallback(() => {
    const tmp = sessionStorage.getItem('userInfo');

    if (!tmp) {
      setMoveMain(true);
      return;
    }

    const { nickname } = JSON.parse(tmp);
    const title = _title.current?.value;
    const content = _content.current?.value;

    if (title === '') {
      Swal.fire({
        icon: 'error',
        title: '글쓰기',
        text: '제목을 입력해주세요',
        didOpen: () => document.body.removeAttribute('class'),
        didClose: () => _title.current?.focus()
      });
      return;
    }

    if (content === '') {
      Swal.fire({
        icon: 'error',
        title: '글쓰기',
        text: '내용을 입력해주세요',
        didOpen: () => document.body.removeAttribute('class'),
        didClose: () => _content.current?.focus()
      });
      return;
    }

    sendPostData({
      variables: {
        nickname,
        title,
        content
      }
    });
  }, [_title, _content, sendPostData]);

  useEffect(() => {
    if (data !== undefined) {
      Swal.fire({
        icon: data?.write.result ? 'success' : 'error',
        title: '글쓰기',
        text: data?.write.message,
        didOpen: () => document.body.removeAttribute('class'),
        didClose: () => {
          if (data?.write.result) {
            setMoveMain(true);
          }
        }
      });
    }
  }, [data]);

  return (
    <>
      {moveMain && <Redirect to='/'/>}

      <Form.Group
        style={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          marginBottom: 0,
          padding: '20px'
        }}
      >
        <Form.Label>제목</Form.Label>
        <Form.Control ref={_title}/>

        <Form.Label style={{ marginTop: '20px' }}>내용</Form.Label>
        <Form.Control
          ref={_content}
          as="textarea"
          style={{
            flex: 1,
            resize: 'none'
          }}
        />
        
        <Button
          style={{ margin: '20px 0 0 0' }}
          onClick={write}
        >
          등록
        </Button>
      </Form.Group>
    </>
  );
};

export default Contents;