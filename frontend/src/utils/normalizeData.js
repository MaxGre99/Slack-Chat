export default (data) => {
  const normalizedData = {
    channels: {
      entitites: {},
      ids: [],
    },
    messages: {
      entitites: {},
      ids: [],
    },
    currentChannelId: null,
  };

  const { channels, messages, currentChannelId } = data;
  channels.forEach((channel) => {
    normalizedData.channels.entities[channel.id] = channel;
    normalizedData.channels.ids.push(channel.id);
  });

  messages.forEach((message) => {
    normalizedData.messages.entities[message.id] = message;
    normalizedData.messages.ids.push(message.id);
  });

  normalizedData.currentChannelId = currentChannelId;

  console.log(normalizedData);
  return normalizedData;
};
