import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from 'react-router-dom';
import { Container, Navbar } from 'react-bootstrap';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MainPage from './MainPage';
import LoginPage from './LoginPage';
import ErrorPage from './ErrorPage';
import SignUpPage from './SignUpPage';
import { LoggedInRoute, LogOutButton } from '../providers/AuthProvider';
import routes from '../routes';

const App = () => (
  <BrowserRouter>
    <div className="d-flex flex-column h-100">
      <Navbar className="shadow-sm" bg="white" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to={routes.mainPage()}>
            Hexlet Chat
          </Navbar.Brand>
          <LogOutButton />
        </Container>
      </Navbar>
      <Routes>
        <Route path={routes.notFoundPage()} element={<ErrorPage />} />
        <Route
          path={routes.mainPage()}
          element={(
            <LoggedInRoute>
              <MainPage />
            </LoggedInRoute>
          )}
        />
        <Route path={routes.loginPage()} element={<LoginPage />} />
        <Route path={routes.signUpPage()} element={<SignUpPage />} />
      </Routes>
    </div>
    <ToastContainer />
  </BrowserRouter>
);

export default App;
