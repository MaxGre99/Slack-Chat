import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Row,
  Col,
  Button,
  // Form,
  // InputGroup,
} from 'react-bootstrap';
import axios from 'axios';
// import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import filter from 'leo-profanity';
import { actions as channelsActions } from '../slices/channelsSlice';
import { actions as messagesActions } from '../slices/messagesSlice';
import Channels from './Channels';
import MessagesBox from './MessagesBox';
import getModal from '../modals/index.js';

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
  const userId = JSON.parse(localStorage.getItem('userId'));
  const getAuthHeader = () => {
    if (userId && userId.token) {
      return { Authorization: `Bearer ${userId.token}` };
    }
    return {};
  };

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

  // Функции и настройки для модальных окон
  const [modalType, setModal] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(modalType !== '');
  const onClose = () => setModalIsOpen(!modalIsOpen);
  const ModalComponent = getModal(modalType);

  // Набор useEffect'ов и функций для скролла вниз
  const channelsBoxRef = useRef(null);

  useEffect(() => {
    channelsBoxRef.current = document.getElementById('channels-box');
  }, []);

  const scrollToBottomChannels = () => {
    if (channelsBoxRef.current) {
      channelsBoxRef.current.scrollTop = channelsBoxRef.current.scrollHeight;
    }
  };

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
        <MessagesBox
          chosenChannel={chosenChannel}
          userId={userId}
          filter={filter}
          errorNotify={errorNotify}
          t={t}
        />
      </Row>
      {modalIsOpen && (
        <ModalComponent
          onClose={onClose}
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
