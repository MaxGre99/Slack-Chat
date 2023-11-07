import React from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import logo from '../public/Ошибка 404.jpg';
import routes from '../routes';

const ErrorPage = () => {
  const { t } = useTranslation();
  return (
    <Container fluid className="h-100">
      <Row className="justify-content-center align-content-center h-100">
        <Col xs={12} md={8} xxl={6}>
          <Card className="shadow-sm">
            <Card.Body className="row p-5">
              <Col xs={12} md={6} className="d-flex align-items-center justify-content-center">
                <div style={{ overflow: 'hidden' }}>
                  <img
                    src={logo}
                    className="rounded-circle"
                    alt={t('descriptions.error404')}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </div>
              </Col>
              <Form
                className="col-12 col-md-6 mt-3 mt-mb-0"
              >
                <h1 className="text-center mb-4">{t('descriptions.oops')}</h1>
                <h6>{t('descriptions.noPage')}</h6>
              </Form>
            </Card.Body>
            <Card.Footer className="p-4">
              <div className="text-center">
                <span>{t('descriptions.redirect')}</span>
                <a href={routes.mainPage()}>{t('descriptions.toMainpage')}</a>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ErrorPage;
