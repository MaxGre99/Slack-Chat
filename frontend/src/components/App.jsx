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
import SignupPage from './SignupPage';
import { LoggedInRoute, LogOutButton } from '../providers/AuthProvider';

const App = () => (
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
);

export default App;
