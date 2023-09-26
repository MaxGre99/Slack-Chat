import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  InputGroup,
} from 'react-bootstrap';
import axios from 'axios';
import io from 'socket.io-client';
import { useFormik } from 'formik';
import { actions as channelsActions } from '../slices/channelsSlice';
import { actions as messageActions } from '../slices/messagesSlice';
import Channels from './Channels';
import Messages from './Messages';

// Инициализация сокета
const socket = io('http://localhost:3000');

const MainPage = () => {
  // Переменные и функции
  const dispatch = useDispatch();
  const [chosenChannel, setChannel] = useState({});
  const userId = JSON.parse(localStorage.getItem('userId'));
  const getAuthHeader = () => {
    if (userId && userId.token) {
      return { Authorization: `Bearer ${userId.token}` };
    }
    return {};
  };
  const allMessages = useSelector((state) => Object.values(state.messagesReducer.entities));
  const chosenMessages = allMessages.filter((message) => message.channelId === chosenChannel.id);

  // useEffect на начальный запрос при отрисовке страницы
  useEffect(() => {
    const config = {
      headers: getAuthHeader(),
    };

    const fetchData = async () => {
      try {
        const response = await axios.get('/api/v1/data', config);
        const { channels, messages, currentChannelId } = response.data;
        dispatch(channelsActions.addChannels(channels));
        dispatch(messageActions.addMessages(messages));
        setChannel(channels.find((channel) => channel.id === currentChannelId));
      } catch (error) {
        //
      }
    };
    fetchData();
  }, []);

  // Настройки формы для сообщений
  const formik = useFormik({
    initialValues: {
      body: '',
      channelId: chosenChannel.id,
      username: userId.name,
    },
    onSubmit: (values) => {
      socket.emit('newMessage', values);
    },
  });

  // useEffect на слежку за выбранным каналом
  useEffect(() => {
    if (chosenChannel && chosenChannel.id) {
      formik.setFieldValue('channelId', chosenChannel.id);
    }
  }, [chosenChannel]);

  // Cокеты
  socket.on('newMessage', (message) => {
    dispatch(messageActions.addMessage(message));
  });

  return (
    <Container className="h-100 my-4 overflow-hidden rounded shadow">
      <Row className="h-100 bg-white flex-md-row">
        <Col
          xs={4}
          md={2}
          className="border-end px-0 bg-light flex-column h-100 d-flex"
        >
          <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
            <b>Каналы</b>
            <Button variant="group-vertical" className="p-0 text-primary">
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
          <Channels chosenChannel={chosenChannel} setChannel={setChannel} />
        </Col>
        <Col className="p-0 h-100">
          <div className="d-flex flex-column h-100">
            <div className="bg-light mb-4 p-3 shadow-sm small">
              <p className="m-0">
                <b>
                  #
                  {' '}
                  {chosenChannel.name}
                </b>
              </p>
              <span className="text-muted">
                {chosenMessages.length}
                сообщений
              </span>
            </div>
            <Messages chosenMessages={chosenMessages} />
            <div className="mt-auto px-5 py-3">
              <Form noValidate className="py-1 border rounded-2" onSubmit={formik.handleSubmit}>
                <InputGroup hasValidation={formik.values.body.length === 0 && true}>
                  <Form.Control name="body" aria-label="Новое сообщение" placeholder="Введите сообщение..." className="border-0 p-0 ps-2" value={formik.values.body} onChange={formik.handleChange} />
                  <Button type="submit" variant="group-vertical" disabled={formik.values.body.length === 0 && true}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                      <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
                    </svg>
                    <span className="visually-hidden">Отправить</span>
                  </Button>
                </InputGroup>
              </Form>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default MainPage;
