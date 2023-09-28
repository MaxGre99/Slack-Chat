import React from 'react';
import { Modal, Button, CloseButton } from 'react-bootstrap';

const Rename = ({
  onClose,
  socket,
  chosenChannel,
  setGeneralChannel,
}) => (
  <Modal centered show onHide={() => onClose()}>
    <Modal.Header>
      <Modal.Title>Удалить канал</Modal.Title>
      <CloseButton onClick={() => onClose()} />
    </Modal.Header>
    <Modal.Body>
      <p className="lead">Уверены?</p>
      <div className="d-flex justify-content-end">
        <Button variant="secondary" className="me-2" onClick={() => onClose()}>
          Отменить
        </Button>
        <Button variant="danger" onClick={() => { socket.emit('removeChannel', { id: chosenChannel.id }); onClose(); setGeneralChannel(); }}>Отправить</Button>
      </div>
    </Modal.Body>
  </Modal>
);

export default Rename;
