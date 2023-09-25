import React, { useState } from 'react';
import { useFormik } from 'formik';
import {
  Form,
  Button,
  Container,
  Row,
  Card,
  FloatingLabel,
} from 'react-bootstrap';
import * as Yup from 'yup';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  });

  const { loggedIn, logIn } = useAuth();
  const [feedback, setFeedback] = useState(!loggedIn);
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
              token: response.data.token,
            })
          );
          logIn();
          navigate('/');
          setFeedback(false);
          console.log(typeof localStorage);
        }
      } catch (error) {
        formik.setFieldError(
          'username',
          'The username or password is incorrect'
        );
        setFeedback(true);
      }
    },
  });

  return (
    <Container fluid className="h-100">
      <Row className="justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <Card className="shadow-sm">
            <Card.Body className="row p-5">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <img
                  src="../public/Без названия.jpeg"
                  className="rounded-circle"
                  alt="Войти"
                />
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
                      id="username"
                      required
                      value={formik.values.username}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {/* {formik.touched.username && formik.errors.username && (
                      <div className="text-danger">
                        {formik.errors.username}
                      </div>
                    )} */}
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
                      id="password"
                      required
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {/* {formik.touched.password && formik.errors.password && (
                      <div className="text-danger">
                        {formik.errors.password}
                      </div>
                    )} */}
                  </FloatingLabel>
                  {/* {formik.errors.username && feedback === true && (
                    // Выводим ошибку, если она есть и поле было "дотронуто" (touch)
                    <div className="feedback">{formik.errors.username}</div>
                  )} */}
                  <Button type="submit" variant="outline-primary">
                    Войти
                  </Button>
                </Form>
              </div>
            </Card.Body>
            <Card.Footer className="p-4">
              <div className="text-center">
                <span>Нет аккаунта?</span>
                <a href="/signup">Регистрация</a>
              </div>
            </Card.Footer>
          </Card>
        </div>
      </Row>
    </Container>
  );
};

export default LoginPage;
