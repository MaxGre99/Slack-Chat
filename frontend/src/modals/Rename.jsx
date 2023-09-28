import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
// import _ from 'lodash';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Modal,
  Form,
  Button,
  CloseButton,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const Rename = ({ onClose, socket, chosenChannel }) => {
  const { t } = useTranslation();
  const renameChannelInput = useRef();
  useEffect(() => renameChannelInput.current.select(), []);

  const channels = useSelector((state) => Object.values(state.channelsReducer.entities));
  const channelsNames = channels.map((channel) => channel.name);

  const validationSchema = yup.object().shape({
    name: yup.string().required(t('errors.required')).notOneOf(channelsNames, t('errors.shouldBeUnique')),
  });

  const formik = useFormik({
    initialValues: {
      id: chosenChannel.id,
      name: chosenChannel.name,
    },
    validationSchema,
    onSubmit: (values) => {
      socket.emit('renameChannel', values);
      onClose();
    },
  });

  return (
    <Modal centered show onHide={() => onClose()}>
      <Modal.Header>
        <Modal.Title>{t('modals.renameTitle')}</Modal.Title>
        <CloseButton onClick={() => onClose()} />
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <div>
            <Form.Control
              name="name"
              id="name"
              className={`mb-2 ${formik.touched.name && formik.errors.name ? 'is-invalid' : ''}`}
              value={formik.values.name}
              onChange={formik.handleChange}
              ref={renameChannelInput}
            />
            <Form.Label className="visually-hidden" htmlFor="name">
              {t('modals.channelName')}
            </Form.Label>
            <div className="invalid-feedback">{formik.touched.name && formik.errors.name}</div>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => onClose()}>
                {t('modals.decline')}
              </Button>
              <Button variant="primary" type="submit">{t('modals.submit')}</Button>
            </div>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Rename;
