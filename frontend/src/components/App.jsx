import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { Button, Container, Navbar } from 'react-bootstrap';
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ErrorBoundary, Provider } from '@rollbar/react';
import AuthContext from '../contexts/AuthContext';
import MainPage from './MainPage';
import LoginPage from './LoginPage';
import ErrorPage from './ErrorPage';
import SignupPage from './SignupPage';
import useAuth from '../hooks/useAuth';

const rollbarCongif = {
  accessToken: 'POST_CLIENT_ITEM_ACCESS_TOKEN',
  environment: 'production',
};

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
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
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
  const { t } = useTranslation();

  return (
    loggedIn && (
      <Button type="button" onClick={logOut}>
        {t('buttons.logout')}
      </Button>
    )
  );
};

const App = () => (
  <Provider config={rollbarCongif}>
    <ErrorBoundary>
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
          <ToastContainer />
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  </Provider>
);

export default App;
