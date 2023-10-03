import React from 'react';
import { Modal, Button, CloseButton } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import useSocket from '../hooks/useSocket';

const Rename = ({
  onClose,
  chosenChannel,
  setGeneralChannel,
  successNotify,
  errorNotify,
}) => {
  const { t } = useTranslation();
  const socket = useSocket();
  const callback = () => {
    onClose();
    setGeneralChannel();
    successNotify(t('toasts.removeChannel'));
  };

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
              try {
                socket.removeChannel(chosenChannel.id, callback);
              } catch (err) {
                errorNotify(t('errors.connectionError'));
              }
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
