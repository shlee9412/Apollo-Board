import { useLazyQuery } from "@apollo/react-hooks";
import { useEffect } from "react";
import { Form } from "react-bootstrap";
import { Redirect } from "react-router";
import { ONE_POST } from "../../gql";
import { convertDateString } from "../../utils";

interface PropsType {
  postIdx: number
}

const Contents = ({ postIdx }: PropsType) => {
  const [sendPostIdx, { loading, data }] = useLazyQuery(ONE_POST);

  useEffect(() => {
    sendPostIdx({ variables: { postIdx: +postIdx } });
  }, [postIdx]);

  if (loading) return <></>;
  if (!data) return <></>;

  return (
    <>
      <Form.Group
        style={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          marginBottom: 0,
          padding: '20px'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Form.Label>제목</Form.Label>
          <Form.Label style={{ fontSize: '12px' }}>
            <span style={{ fontWeight: 'bold' }}>{data.posts[0].nickname}</span> ({convertDateString(data.posts[0].regdate)})
          </Form.Label>
        </div>
        <Form.Control disabled value={data.posts[0].title}/>

        <Form.Label style={{ marginTop: '20px' }}>내용</Form.Label>
        <Form.Control
          as="textarea"
          disabled
          value={data.posts[0].content}
          style={{
            flex: 1,
            resize: 'none'
          }}
        />
      </Form.Group>
    </>
  );
};

export default Contents;