import { Nav, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const Channels = ({ chosenChannel, setChannel }) => {
  const channels = useSelector((state) => Object.values(state.channelsReducer.entities));

  return (
    <Nav
      as="ul"
      id="channels-box"
      className="flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block"
    >
      {channels.map((channel) => (
        <Nav.Item
          as="li"
          className="w-100"
          key={channel.id}
          onClick={() => setChannel(channel)}
        >
          <Button
            variant={chosenChannel.id === channel.id && 'secondary'}
            className="w-100 rounded-0 text-start"
          >
            <span className="me-1">#</span>
            {channel.name}
          </Button>
        </Nav.Item>
      ))}
    </Nav>
  );
};

export default Channels;

// onClick={setChannel(channels.find((channelInState) => channel.id === channelInState.id))}
