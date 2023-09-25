import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MainPage = () => {
  const getAuthHeader = () => {
    const userId = JSON.parse(localStorage.getItem('userId'));
  
    if (userId && userId.token) {
      return { Authorization: `Bearer ${userId.token}` };
    }
  
    return {};
  };

  const [text, setText] = useState('');

  useEffect(() => {
    const config = {
      headers: getAuthHeader(),
    };

    const fetchData = async () => {
      try {
        const response = await axios.get('/api/v1/data', config);
        setText(response.data);
        // console.log(text);
      } catch (error) {
        // console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      This is the Main Page!
    </div>
  );
};

export default MainPage;
