import React, { useMemo } from 'react';
import { io } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import SocketContext from '../contexts/SocketContext';
import { actions as channelsActions } from '../slices/channelsSlice';
import { actions as messagesActions } from '../slices/messagesSlice';

const socket = io();

const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();

  socket.on('newChannel', (payload) => {
    dispatch(channelsActions.addChannel(payload));
  });

  socket.on('removeChannel', (payload) => {
    const { id } = payload;
    dispatch(channelsActions.removeChannel(id));
  });

  socket.on('newMessage', (payload) => {
    dispatch(messagesActions.addMessage(payload));
  });

  socket.on('renameChannel', (payload) => {
    dispatch(channelsActions.upsertChannel(payload));
  });

  const addChannel = (name, callback) => {
    socket.emit('newChannel', { name }, (response) => {
      if (response.status === 'ok') {
        callback(response.data);
      }
    });
  };

  const removeChannel = (id, callback) => {
    socket.emit('removeChannel', { id }, (response) => {
      if (response.status === 'ok') {
        callback();
      }
    });
  };

  const addMessage = (body, channelId, username, callback) => {
    socket.emit('newMessage', { body, channelId, username }, (response) => {
      if (response.status === 'ok') {
        callback();
      }
    });
  };

  const renameChannel = (id, name, callback) => {
    socket.emit('renameChannel', { id, name }, (response) => {
      if (response.status === 'ok') {
        callback();
      }
    });
  };

  const memo = useMemo(() => ({
    addChannel, removeChannel, addMessage, renameChannel,
  }));

  return (
    <SocketContext.Provider value={memo}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
