import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import React, { useState, useMemo } from 'react';
import AuthContext from '../contexts/AuthContext';
import MainPage from './MainPage';
import LoginPage from './LoginPage';
import ErrorPage from './ErrorPage';
import SignupPage from './SignupPage';
import useAuth from '../hooks/useAuth';

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState('userId' in localStorage);

  const contextValue = useMemo(() => {
    const logIn = () => setLoggedIn(true);
    const logOut = () => {
      localStorage.clear();
      setLoggedIn(false);
    };
    return { loggedIn, logIn, logOut };
  }, [loggedIn]); // Include any dependencies that affect the context value

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

const LoggedInRoute = ({ children }) => {
  const { loggedIn } = useAuth();
  const location = useLocation();
  return loggedIn ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  );
};

const LogOutButton = () => {
  const { loggedIn, logOut } = useAuth();

  return (
    loggedIn && (
      <Button type="button" onClick={logOut}>
        Выйти
      </Button>
    )
  );
};

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <div className="d-flex flex-column h-100">
        <Navbar className="shadow-sm" bg="white" expand="lg">
          <Container>
            <Navbar.Brand as={Link} to="/">
              Hexlet Chat
            </Navbar.Brand>
            <LogOutButton />
          </Container>
        </Navbar>
        <Routes>
          <Route path="*" element={<ErrorPage />} />
          <Route
            path="/"
            element={(
              <LoggedInRoute>
                <MainPage />
              </LoggedInRoute>
            )}
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
