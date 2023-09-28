import React from 'react';
import { useTranslation } from 'react-i18next';

const ErrorPage = () => {
  const { t } = useTranslation();
  return <div>{t('descriptions.notFound')}</div>;
};

export default ErrorPage;
