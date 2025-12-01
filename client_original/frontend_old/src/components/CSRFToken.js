import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

const CSRFToken = () => {
  const [csrftoken, setCsrftoken] = useState('');

  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      let cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + '=') {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await axios.get(
          'http://localhost:8000/accounts/api/token'
        );
        if (response.status === 200) {
          setCsrftoken(getCookie('csrftoken'));
        }
      } catch (err) {}
    };
    fetchData();
  }, []);

  return <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />;
};

export default CSRFToken;
