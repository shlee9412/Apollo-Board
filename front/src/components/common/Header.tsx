import { useCallback, useState } from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { Redirect, Link } from 'react-router-dom';

const Header = () => {
  const [moveLogin, setMoveLogin] = useState<boolean>(false);

  const logout = useCallback(() => {
    sessionStorage.clear();
    setMoveLogin(true);
  }, []);

  return (
    <>
      {moveLogin && <Redirect to='/login'/>}

      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="/">게시판</Navbar.Brand>
        <Nav className="mr-auto">
          {sessionStorage.getItem('userInfo') && (
            <>
              <Nav.Link href="/write">글쓰기</Nav.Link>
              <Nav.Link href="/modify">회원정보</Nav.Link>
            </>
          )}
        </Nav>
        {sessionStorage.getItem('userInfo') && (
          <Button onClick={logout}>로그아웃</Button>
        )}
        {!sessionStorage.getItem('userInfo') && (
          <Link to='/regist'>
            <Button>회원가입</Button>
          </Link>
        )}
      </Navbar>
    </>
  );
};

export default Header;