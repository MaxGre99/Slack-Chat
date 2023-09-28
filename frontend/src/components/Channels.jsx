import React from 'react';
import {
  Nav,
  Button,
  ButtonGroup,
  Dropdown,
} from 'react-bootstrap';

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
}) => (
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
      <span className="visually-hidden">Управление каналом</span>
    </Dropdown.Toggle>
    <Dropdown.Menu aria-labelledby={channel.id}>
      <Dropdown.Item
        onClick={() => {
          setModal('removing');
          onClose();
        }}
      >
        Удалить
      </Dropdown.Item>
      <Dropdown.Item
        onClick={() => {
          setModal('renaming');
          onClose();
        }}
      >
        Переименовать
      </Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>
);

const Channels = ({
  chosenChannel,
  setChosenChannel,
  setModal,
  onClose,
  allChannels,
}) => (
  <Nav
    as="ul"
    id="channels-box"
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
);

export default Channels;
