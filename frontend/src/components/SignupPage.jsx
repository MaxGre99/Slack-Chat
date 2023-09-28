import React from 'react';
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
import * as yup from 'yup';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import logo from '../public/Регистрация.jpg';

const SignupPage = () => {
  const validationSchema = yup.object().shape({
    username: yup.string().required('Обязательное поле').min(3, 'От 3 до 20 символов').max(20, 'От 3 до 20 символов'),
    password: yup.string().required('Обязательное поле').min(6, 'Не менее 6 символов'),
    confirmPassword: yup.string().oneOf([yup.ref('password')], 'Пароли не совпадают'),
  });

  const { logIn } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      resetForm();
      try {
        const response = await axios.post('/api/v1/signup', values);
        if (response.status === 201) {
          localStorage.setItem(
            'userId',
            JSON.stringify({
              name: `${values.username}`,
              token: response.data.token,
            }),
          );
          logIn();
          navigate('/');
          console.log(localStorage);
        }
      } catch (err) {
        if (err.response.status === 409) {
          formik.setFieldError('confirmPassword', 'Такой пользователь уже существует');
        }
      }
    },
  });

  return (
    <Container fluid className="h-100">
      <Row className="justify-content-center align-content-center h-100">
        <Col xs={12} md={8} xxl={6}>
          <Card className="shadow-sm">
            <Card.Body className="d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
              <div>
                <img src={logo} className="rounded-circle" alt="Регистрация" />
              </div>
              <Form
                className="w-50"
                onSubmit={formik.handleSubmit}
              >
                <h1 className="text-center mb-4">Регистрация</h1>
                <FloatingLabel
                  className="mb-3"
                  label="Имя пользователя"
                >
                  <Form.Control
                    name="username"
                    autoComplete="username"
                    placeholder="От 3 до 20 символов"
                    id="username"
                    className={formik.errors.username && 'is-invalid'}
                    required
                    value={formik.values.username}
                    // onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                  />
                  <div className="invalid-tooltip">{formik.errors.username}</div>
                </FloatingLabel>
                <FloatingLabel
                  className="mb-4"
                  label="Пароль"
                >
                  <Form.Control
                    name="password"
                    aria-describedby="passwordHelpBlock"
                    autoComplete="new-password"
                    placeholder="Не менее 6 символов"
                    id="password"
                    type="password"
                    className={formik.errors.password && 'is-invalid'}
                    required
                    value={formik.values.password}
                    // onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                  />
                  <div className="invalid-tooltip">{formik.errors.password}</div>
                </FloatingLabel>
                <FloatingLabel
                  className="mb-4"
                  label="Подтвердите пароль"
                >
                  <Form.Control
                    name="confirmPassword"
                    autoComplete="new-password"
                    placeholder="Пароли должны совпадать"
                    id="confirmPassword"
                    type="password"
                    className={formik.errors.confirmPassword && 'is-invalid'}
                    required
                    value={formik.values.confirmPassword}
                    // onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                  />
                  <div className="invalid-tooltip">{formik.errors.confirmPassword}</div>
                </FloatingLabel>
                <Button type="submit" variant="outline-primary" className="w-100">
                  Зарегистрироваться
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SignupPage;
