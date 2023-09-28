import React from 'react';
import { Modal, Button, CloseButton } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const Rename = ({
  onClose,
  socket,
  chosenChannel,
  setGeneralChannel,
  successNotify,
  errorNotify,
}) => {
  const { t } = useTranslation();
  return (
    <Modal centered show onHide={() => onClose()}>
      <Modal.Header>
        <Modal.Title>{t('modals.removeTitle')}</Modal.Title>
        <CloseButton onClick={() => onClose()} />
      </Modal.Header>
      <Modal.Body>
        <p className="lead">{t('modals.sure')}</p>
        <div className="d-flex justify-content-end">
          <Button
            variant="secondary"
            className="me-2"
            onClick={() => onClose()}
          >
            {t('modals.decline')}
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              socket.emit('removeChannel', { id: chosenChannel.id }, (response) => {
                if (response.status === 'ok') {
                  onClose();
                  setGeneralChannel();
                  successNotify(t('toasts.removeChannel'));
                } else {
                  errorNotify(t('errors.connectionError'));
                }
              });
            }}
          >
            {t('modals.submit')}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Rename;
