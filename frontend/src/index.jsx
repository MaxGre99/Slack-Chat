import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
// import Rollbar from 'rollbar';
import {
  Provider as RollbarProvider,
  ErrorBoundary,
} from '@rollbar/react';
import i18n from './i18n';
import './styles/index.css';
import App from './components/App.jsx';
import store from './slices/index';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';

const rollbarConfig = {
  accessToken: '754eab26a4db48c0a26588006a78b5ee',
  environment: 'testenv',
};

const root = ReactDOM.createRoot(document.getElementById('chat'));
root.render(
  <RollbarProvider config={rollbarConfig}>
    <ErrorBoundary>
      <React.StrictMode>
        <I18nextProvider i18n={i18n} defaultNS="translation">
          <ReduxProvider store={store}>
            <App />
          </ReduxProvider>
        </I18nextProvider>
      </React.StrictMode>
    </ErrorBoundary>
  </RollbarProvider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
