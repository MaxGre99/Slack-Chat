import React, { useRef, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Modal,
  Form,
  Button,
  CloseButton,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import useSocket from '../hooks/useSocket';

const Add = ({
  onClose,
  successNotify,
  errorNotify,
  allChannels,
  setChosenChannel,
  filter,
}) => {
  const { t } = useTranslation();
  const addChannelInput = useRef();
  useEffect(() => addChannelInput.current.focus(), []);

  const socket = useSocket();

  const callback = (channel) => {
    setChosenChannel(channel);
    onClose();
    successNotify(t('toasts.addChannel'));
  };

  const channelsNames = allChannels.map((channel) => channel.name);

  const validationSchema = yup.object().shape({
    name: yup.string().trim().required(t('errors.required')).notOneOf(channelsNames, t('errors.shouldBeUnique')),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema,
    onSubmit: (values) => {
      try {
        socket.addChannel(filter.clean(values.name), callback);
      } catch (err) {
        errorNotify(t('errors.connectionError'));
      }
    },
  });

  return (
    <Modal centered show onHide={() => onClose()}>
      <Modal.Header>
        <Modal.Title>{t('modals.addTitle')}</Modal.Title>
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
              ref={addChannelInput}
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

export default Add;
