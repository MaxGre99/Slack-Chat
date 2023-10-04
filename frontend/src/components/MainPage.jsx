import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Row,
  // Col,
  // Button,
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
import ChannelsBox from './ChannelsBox';
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

  /* Набор useEffect'ов и функций для скролла вниз
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
  }, [allChannels]); */

  return (
    <Container className="h-100 my-4 overflow-hidden rounded shadow">
      <Row className="h-100 bg-white flex-md-row">
        <ChannelsBox
          chosenChannel={chosenChannel}
          setChosenChannel={setChosenChannel}
          setModal={setModal}
          onClose={onClose}
          allChannels={allChannels}
        />
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
          setChosenChannel={setChosenChannel}
          setGeneralChannel={setGeneralChannel}
          successNotify={successNotify}
          errorNotify={errorNotify}
          allChannels={allChannels}
          filter={filter}
        />
      )}
    </Container>
  );
};

export default MainPage;
