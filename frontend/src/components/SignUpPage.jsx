import React, { useEffect, useRef } from 'react';
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
import logo from '../public/Регистрация.jpg';
import routes from '../routes';

const SignUpPage = () => {
  const { t } = useTranslation();
  const usernameEl = useRef(null);
  useEffect(() => usernameEl.current.focus(), []);
  const validationSchema = yup.object().shape({
    username: yup
      .string()
      .trim()
      .required(t('errors.required'))
      .min(3, t('errors.usernameLength'))
      .max(20, t('errors.usernameLength')),
    password: yup.string().trim().required(t('errors.required')).min(6, t('errors.passwordLength')),
    confirmPassword: yup.string().trim().oneOf([yup.ref('password')], t('errors.passwordShouldMatch')),
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
    onSubmit: async (values) => {
      try {
        const response = await axios.post(routes.signUp(), values);
        if (response.status === 201) {
          localStorage.setItem(
            'userId',
            JSON.stringify({
              name: `${values.username}`,
              token: response.data.token,
            }),
          );
          logIn();
          navigate(routes.mainPage());
        }
      } catch (err) {
        if (err.response.status === 409) {
          formik.setFieldError('confirmPassword', t('errors.userAlreadyExists'));
          usernameEl.current.select();
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
                <img src={logo} className="rounded-circle" alt={t('descriptions.registration')} />
              </div>
              <Form
                className="w-50"
                onSubmit={formik.handleSubmit}
              >
                <h1 className="text-center mb-4">{t('descriptions.registration')}</h1>
                <FloatingLabel
                  className="mb-3"
                  label={t('forms.username')}
                  controlId="username"
                >
                  <Form.Control
                    ref={usernameEl}
                    name="username"
                    autoComplete="username"
                    placeholder={t('errors.usernameLength')}
                    className={formik.touched.username && (formik.errors.confirmPassword === t('errors.userAlreadyExists') || formik.errors.username) ? 'is-invalid' : ''}
                    required
                    value={formik.values.username}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                  />
                  <Form.Control.Feedback type="invalid" tooltip>
                    {formik.errors.username}
                  </Form.Control.Feedback>
                </FloatingLabel>
                <FloatingLabel
                  className="mb-4"
                  label={t('forms.password')}
                  controlId="password"
                >
                  <Form.Control
                    name="password"
                    aria-describedby="passwordHelpBlock"
                    autoComplete="new-password"
                    placeholder={t('errors.passwordLength')}
                    type="password"
                    className={formik.touched.password && (formik.errors.confirmPassword === t('errors.userAlreadyExists') || formik.errors.password) ? 'is-invalid' : ''}
                    required
                    value={formik.values.password}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                  />
                  <Form.Control.Feedback type="invalid" tooltip>
                    {formik.errors.password}
                  </Form.Control.Feedback>
                </FloatingLabel>
                <FloatingLabel
                  className="mb-4"
                  label={t('forms.confirmPassword')}
                  controlId="confirmPassword"
                >
                  <Form.Control
                    name="confirmPassword"
                    autoComplete="new-password"
                    placeholder={t('errors.passwordShouldMatch')}
                    type="password"
                    isInvalid={formik.touched.confirmPassword && formik.errors.confirmPassword}
                    required
                    value={formik.values.confirmPassword}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                  />
                  <Form.Control.Feedback type="invalid" tooltip>
                    {formik.errors.confirmPassword}
                  </Form.Control.Feedback>
                </FloatingLabel>
                <Button type="submit" variant="outline-primary" className="w-100">
                  {t('buttons.register')}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SignUpPage;
