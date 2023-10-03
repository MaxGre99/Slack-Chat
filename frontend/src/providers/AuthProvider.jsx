import React, { useState, useMemo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import AuthContext from '../contexts/AuthContext';
import useAuth from '../hooks/useAuth';

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState('userId' in localStorage);

  const contextValue = useMemo(() => {
    const logIn = () => setLoggedIn(true);
    const logOut = () => {
      localStorage.clear();
      setLoggedIn(false);
    };
    return { loggedIn, logIn, logOut };
  }, [loggedIn]); // Include any dependencies that affect the context value

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const LoggedInRoute = ({ children }) => {
  const { loggedIn } = useAuth();
  const location = useLocation();
  return loggedIn ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  );
};

export const LogOutButton = () => {
  const { loggedIn, logOut } = useAuth();
  const { t } = useTranslation();

  return (
    loggedIn && (
      <Button type="button" onClick={logOut}>
        {t('buttons.logout')}
      </Button>
    )
  );
};
