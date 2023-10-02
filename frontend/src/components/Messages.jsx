import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  Col,
  Form,
  InputGroup,
  Button,
} from 'react-bootstrap';
import { useFormik } from 'formik';

const MessagesBox = ({
  chosenChannel,
  userId,
  socket,
  filter,
  errorNotify,
  t,
}) => {
  const messageInput = useRef();
  const [isSending, setSendingState] = useState(false);
  const allMessages = useSelector((state) => Object.values(state.messagesReducer.entities));
  const chosenMessages = allMessages.filter((message) => message.channelId === chosenChannel.id);

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
        } else {
          errorNotify(t('errors.connectionError'));
        }
      });
      formik.values.body = '';
      messageInput.current.focus();
    },
  });

  /* useEffect(() => {
    document
      .getElementById('input')
      .addEventListener('keydown', (event) => {
        if (event.code === 'Enter' || event.code === 'NumpadEnter') {
          event.preventDefault();
          document.getElementById('submit').click();
          console.log('KURWA');
        }
      });
  }, []); */

  // useEffect на слежку за выбранным каналом + фокус-инпут (т.к. фокус тоже нужен при смене канала)
  useEffect(() => {
    if (chosenChannel && chosenChannel.id) {
      formik.setFieldValue('channelId', chosenChannel.id);
      messageInput.current.focus();
    }
  }, [chosenChannel]);

  // Набор useEffect'ов и функций для скролла вниз
  const messagesBoxRef = useRef(null);
  useEffect(() => {
    messagesBoxRef.current = document.getElementById('messages-box');
  }, []);

  const scrollToBottomMessages = () => {
    if (messagesBoxRef.current) {
      messagesBoxRef.current.scrollTop = messagesBoxRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottomMessages();
  }, [chosenMessages]);

  return (
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
        <div id="messages-box" className="chat-messages overflow-auto px-5">
          {chosenMessages.map((message) => (
            <div className="text-break mb-2" key={message.id}>
              <b>{message.username}</b>
              {': '}
              {message.body}
            </div>
          ))}
        </div>
        <div className="mt-auto px-5 py-3">
          <Form noValidate className="py-1 border rounded-2" onSubmit={formik.handleSubmit}>
            <InputGroup hasValidation={formik.values.body.length === 0 && true}>
              <Form.Control
                // id="input"
                ref={messageInput}
                name="body"
                aria-label={t('forms.newMessage')}
                placeholder={t('forms.inputMessage')}
                className="border-0 p-0 ps-2"
                value={formik.values.body}
                onChange={formik.handleChange}
                disabled={isSending}
              />
              <Button type="submit" variant="group-vertical" disabled={formik.values.body.length === 0 && true}/* id="submit" */>
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
  );
};

export default MessagesBox;
