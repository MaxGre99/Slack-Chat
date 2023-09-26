import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import {
  Form,
  Button,
  Container,
  Row,
  Card,
  FloatingLabel,
  Col,
} from 'react-bootstrap';
import * as Yup from 'yup';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import logo from '../public/Без названия.jpeg';

const LoginPage = () => {
  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  });

  const { logIn } = useAuth();
  const [loginError, setError] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      resetForm();
      try {
        const response = await axios.post('/api/v1/login', values);
        if (response.status === 200) {
          localStorage.setItem(
            'userId',
            JSON.stringify({
              name: `${values.username}`,
              token: response.data.token,
            }),
          );
          logIn();
          navigate('/');
          setError(false);
          console.log(localStorage);
        }
      } catch (err) {
        //
        setError(true);
      }
    },
  });

  return (
    <Container fluid className="h-100">
      <Row className="justify-content-center align-content-center h-100">
        <Col xs={12} md={8} xxl={6}>
          <Card className="shadow-sm">
            <Card.Body className="row p-5">
              <Col xs={12} md={6} className="d-flex align-items-center justify-content-center">
                <img src={logo} className="rounded-circle" alt="Войти" />
              </Col>
              <Form
                className="col-12 col-md-6 mt-3 mt-mb-0"
                onSubmit={formik.handleSubmit}
              >
                <h1 className="text-center mb-4">Войти</h1>
                <FloatingLabel
                  className="mb-3"
                  label="Ваш ник"
                  controlId="username"
                >
                  <Form.Control
                    name="username"
                    autoComplete="username"
                    placeholder="Ваш ник"
                    className={loginError && 'is-invalid'}
                    required
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    // onBlur={formik.handleBlur}
                  />
                </FloatingLabel>
                <FloatingLabel
                  className="mb-4"
                  label="Пароль"
                  controlId="password"
                >
                  <Form.Control
                    name="password"
                    autoComplete="current-password"
                    placeholder="Пароль"
                    type="password"
                    className={loginError && 'is-invalid'}
                    required
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    // onBlur={formik.handleBlur}
                  />
                  {loginError && <div className="invalid-tooltip">Неверные имя пользователя или пароль</div>}
                </FloatingLabel>
                <Button type="submit" variant="outline-primary" className="w-100 mb-3">
                  Войти
                </Button>
              </Form>
            </Card.Body>
            <Card.Footer className="p-4">
              <div className="text-center">
                <span>Нет аккаунта? </span>
                <a href="/signup"> Регистрация</a>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
