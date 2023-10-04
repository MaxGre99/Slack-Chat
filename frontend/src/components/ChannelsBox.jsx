import React, { useRef, useEffect } from 'react';
import {
  Col,
  Nav,
  Button,
  ButtonGroup,
  Dropdown,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const NonRemovableChannelButton = ({ chosenChannel, channel }) => (
  <Button
    variant={chosenChannel.id === channel.id && 'secondary'}
    className="w-100 rounded-0 text-start"
  >
    <span className="me-1">#</span>
    {channel.name}
  </Button>
);

const RemovableChannelButton = ({
  chosenChannel,
  channel,
  setModal,
  onClose,
}) => {
  const { t } = useTranslation();
  return (
    <Dropdown as={ButtonGroup} className="d-flex">
      <Button
        className="w-100 rounded-0 text-start text-truncate"
        variant={chosenChannel.id === channel.id && 'secondary'}
      >
        <span className="me-1">#</span>
        {channel.name}
      </Button>
      {/* !!! */}
      <Dropdown.Toggle
        id={channel.id}
        className="flex-grow-0 dropdown-toggle-split"
        variant={chosenChannel.id === channel.id && 'secondary'}
      >
        <span className="visually-hidden">{t('descriptions.channelControl')}</span>
      </Dropdown.Toggle>
      <Dropdown.Menu aria-labelledby={channel.id}>
        <Dropdown.Item
          onClick={() => {
            setModal('removing');
            onClose();
          }}
        >
          {t('buttons.remove')}
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => {
            setModal('renaming');
            onClose();
          }}
        >
          {t('buttons.rename')}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

const Channels = ({
  chosenChannel,
  setChosenChannel,
  setModal,
  onClose,
  allChannels,
}) => {
  // useEffect для скролла вниз
  const channelsBox = useRef();
  useEffect(() => {
    channelsBox.current.scrollTop = channelsBox.current.scrollHeight;
  }, [allChannels]);

  return (
    <Col
      xs={4}
      md={2}
      className="border-end px-0 bg-light flex-column h-100 d-flex"
    >
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <b>Каналы</b>
        <Button variant="group-vertical" className="p-0 text-primary" onClick={() => { setModal('adding'); onClose(); }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            width="20"
            height="20"
            fill="currentColor"
          >
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
          </svg>
          <span className="visually-hidden">+</span>
        </Button>
      </div>
      <Nav
        as="ul"
        id="channels-box"
        ref={channelsBox}
        className="flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block"
      >
        {allChannels.map((channel) => (
          <Nav.Item
            as="li"
            className="w-100"
            key={channel.id}
            onClick={() => setChosenChannel(channel)}
          >
            {channel.removable ? (
              <RemovableChannelButton
                chosenChannel={chosenChannel}
                channel={channel}
                setModal={setModal}
                onClose={onClose}
              />
            ) : (
              <NonRemovableChannelButton
                chosenChannel={chosenChannel}
                channel={channel}
              />
            )}
          </Nav.Item>
        ))}
      </Nav>
    </Col>
  );
};

export default Channels;
