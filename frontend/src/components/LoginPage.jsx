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
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import logo from '../public/Авторизация.jpeg';

const LoginPage = () => {
  const { t } = useTranslation();
  const validationSchema = yup.object().shape({
    username: yup.string().required(t('errors.required')),
    password: yup.string().required(t('errors.required')),
  });

  const { logIn } = useAuth();
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
        }
      } catch (err) {
        if (err.response.status === 401) {
          formik.setFieldError('password', t('errors.notCorrect'));
        }
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
                <img src={logo} className="rounded-circle" alt={t('descriptions.login')} />
              </Col>
              <Form
                className="col-12 col-md-6 mt-3 mt-mb-0"
                onSubmit={formik.handleSubmit}
              >
                <h1 className="text-center mb-4">{t('descriptions.login')}</h1>
                <FloatingLabel
                  className="mb-3"
                  label={t('forms.nickname')}
                  controlId="username"
                >
                  <Form.Control
                    name="username"
                    autoComplete="username"
                    placeholder={t('forms.nickname')}
                    className={formik.errors.password === t('errors.notCorrect') || formik.errors.username ? 'is-invalid' : ''}
                    required
                    value={formik.values.username}
                    onChange={formik.handleChange}
                  />
                </FloatingLabel>
                <FloatingLabel
                  className="mb-4"
                  label={t('forms.password')}
                  controlId="password"
                >
                  <Form.Control
                    name="password"
                    autoComplete="current-password"
                    placeholder={t('forms.password')}
                    type="password"
                    className={formik.errors.password && 'is-invalid'}
                    required
                    value={formik.values.password}
                    onChange={formik.handleChange}
                  />
                  <div className="invalid-tooltip">{formik.errors.password}</div>
                </FloatingLabel>
                <Button type="submit" variant="outline-primary" className="w-100 mb-3">
                  {t('buttons.login')}
                </Button>
              </Form>
            </Card.Body>
            <Card.Footer className="p-4">
              <div className="text-center">
                <span>{t('descriptions.noAccount')}</span>
                <a href="/signup">{t('descriptions.registration')}</a>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
