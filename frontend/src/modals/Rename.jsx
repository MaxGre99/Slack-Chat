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

const Rename = ({ onClose, socket, chosenChannel }) => {
  const renameChannelInput = useRef();
  useEffect(() => renameChannelInput.current.select(), []);

  const channels = useSelector((state) => Object.values(state.channelsReducer.entities));
  const channelsNames = channels.map((channel) => channel.name);
  // console.log(channelsNames);

  const validationSchema = yup.object().shape({
    name: yup.string().required('Обязательное поле').notOneOf(channelsNames, 'Должно быть уникальным'),
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
        <Modal.Title>Переименовать канал</Modal.Title>
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
              Имя канала
            </Form.Label>
            <div className="invalid-feedback">{formik.touched.name && formik.errors.name}</div>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => onClose()}>
                Отменить
              </Button>
              <Button variant="primary" type="submit">Отправить</Button>
            </div>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Rename;
