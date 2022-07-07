import axios from 'axios';

// TODO - Adicionar funcoes de cookies em um helper

function getCookie(name: string) {
  var cookies, c;

  cookies = document.cookie.split(';');
  
  for (var i=0; i < cookies.length; i++) {
      c = cookies[i].split('=');
      if (c[0] == name) {
          return c[1];
      }
  }
  
  return "";
}

function setCookie(cname: string, cvalue: string, exdays: number) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

const api = axios.create({
  baseURL: 'http://localhost:3001'
});

api.interceptors.request.use((config) => {
  const token = getCookie('app.tascomeditor.token');

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  } else {
    delete config.headers?.Authorization
  }

  return config;
});

api.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response;
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  if (error.response.status === 401) {
    setCookie('app.tascomeditor.token', '', -1);
    window.location.href = '/';
  }
  // debugger;
  return Promise.reject(error);
});

export default api;