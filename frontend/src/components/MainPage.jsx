import React, { useEffect, useState, useRef } from 'react';
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
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import filter from 'leo-profanity';
import { actions as channelsActions } from '../slices/channelsSlice';
import { actions as messagesActions } from '../slices/messagesSlice';
import Channels from './Channels';
import Messages from './Messages';
import getModal from '../modals/index.js';

// Инициализация сокета
const socket = io('http://localhost:3000');

// Toastify
const successNotify = (text) => {
  toast.success(text, {
    position: toast.POSITION.TOP_RIGHT,
  });
};
const errorNotify = (text) => {
  toast.error(text, {
    position: toast.POSITION.TOP_RIGHT,
  });
};

// LeoProfanity
filter.add(filter.getDictionary('en'));
filter.add(filter.getDictionary('fr'));
filter.add(filter.getDictionary('ru'));

// Cам компонент
const MainPage = () => {
  // Переменные и функции
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [chosenChannel, setChosenChannel] = useState({});
  const messageInput = useRef();
  const [isSending, setSendingState] = useState(false);
  const userId = JSON.parse(localStorage.getItem('userId'));
  const getAuthHeader = () => {
    if (userId && userId.token) {
      return { Authorization: `Bearer ${userId.token}` };
    }
    return {};
  };

  const allMessages = useSelector((state) => Object.values(state.messagesReducer.entities));
  const chosenMessages = allMessages.filter((message) => message.channelId === chosenChannel.id);
  const allChannels = useSelector((state) => Object.values(state.channelsReducer.entities));
  const setGeneralChannel = () => setChosenChannel(allChannels.find((channel) => channel.id === 1));

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
        dispatch(messagesActions.addMessages(messages));
        setChosenChannel(channels.find((channel) => channel.id === currentChannelId));
      } catch (error) {
        errorNotify(t('errors.connectionError'));
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
      setSendingState(true);
      socket.emit('newMessage', {
        body: filter.clean(values.body),
        channelId: values.channelId,
        username: values.username,
      }, (confirmation) => {
        if (confirmation.status === 'ok') {
          setSendingState(false);
        }
      });
      setTimeout(() => {
        if (isSending) {
        // Если подтверждение не получено, обработайте это здесь
          errorNotify(t('errors.connectionError'));
        }
      }, 5000);
      formik.values.body = '';
      messageInput.current.focus();
    },
  });

  // useEffect на слежку за выбранным каналом + фокус-инпут (т.к. фокус тоже нужен при смене канала)
  useEffect(() => {
    if (chosenChannel && chosenChannel.id) {
      formik.setFieldValue('channelId', chosenChannel.id);
      messageInput.current.focus();
    }
  }, [chosenChannel]);

  useEffect(() => {
    document
      .getElementById('input')
      .addEventListener('keydown', (event) => {
        if (event.code === 'Enter' || event.code === 'NumpadEnter') {
          event.preventDefault();
          document.getElementById('submit').click();
        }
      });
  }, []);

  // Cокеты
  socket.on('newMessage', (message) => {
    dispatch(messagesActions.addMessage(message));
  });
  socket.on('newChannel', (channel) => {
    dispatch(channelsActions.addChannel(channel));
    setChosenChannel(channel);
  });
  socket.on('renameChannel', (channel) => {
    dispatch(channelsActions.upsertChannel(channel));
  });
  socket.on('removeChannel', ({ id }) => {
    dispatch(channelsActions.removeChannel(id));
  });

  // Функции и настройки для модальных окон
  const [modalType, setModal] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(modalType !== '');
  const onClose = () => setModalIsOpen(!modalIsOpen);
  const ModalComponent = getModal(modalType);

  // Набор useEffect'ов и функций для скролла вниз
  const messagesBoxRef = useRef(null);
  const channelsBoxRef = useRef(null);

  useEffect(() => {
    messagesBoxRef.current = document.getElementById('messages-box');
    channelsBoxRef.current = document.getElementById('channels-box');
  }, []);

  const scrollToBottomMessages = () => {
    if (messagesBoxRef.current) {
      messagesBoxRef.current.scrollTop = messagesBoxRef.current.scrollHeight;
    }
  };

  const scrollToBottomChannels = () => {
    if (channelsBoxRef.current) {
      channelsBoxRef.current.scrollTop = channelsBoxRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottomMessages();
  }, [chosenMessages]);

  useEffect(() => {
    scrollToBottomChannels();
  }, [allChannels]);

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
          <Channels
            chosenChannel={chosenChannel}
            setChosenChannel={setChosenChannel}
            setModal={setModal}
            onClose={onClose}
            allChannels={allChannels}
          />
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
                {t('count.messageCount', { count: chosenMessages.length })}
              </span>
            </div>
            <Messages chosenMessages={chosenMessages} />
            <div className="mt-auto px-5 py-3">
              <Form noValidate className="py-1 border rounded-2" onSubmit={formik.handleSubmit}>
                <InputGroup hasValidation={formik.values.body.length === 0 && true}>
                  <Form.Control
                    id="input"
                    ref={messageInput}
                    name="body"
                    aria-label={t('forms.newMessage')}
                    placeholder={t('forms.inputMessage')}
                    className="border-0 p-0 ps-2"
                    value={formik.values.body}
                    onChange={formik.handleChange}
                    disabled={isSending}
                  />
                  <Button type="submit" variant="group-vertical" disabled={formik.values.body.length === 0 && true} id="submit">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                      <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
                    </svg>
                    <span className="visually-hidden">{t('forms.send')}</span>
                  </Button>
                </InputGroup>
              </Form>
            </div>
          </div>
        </Col>
      </Row>
      {modalIsOpen && (
        <ModalComponent
          onClose={onClose}
          socket={socket}
          chosenChannel={chosenChannel}
          setGeneralChannel={setGeneralChannel}
          successNotify={successNotify}
          errorNotify={errorNotify}
          allChannels={allChannels}
        />
      )}
    </Container>
  );
};

export default MainPage;
