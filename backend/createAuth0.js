const dotenv = require('dotenv');
const path = require('path');
const axios = require('axios');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const url = 'https://helpers-admin-test.auth0.com/oauth/token';

const payload = {
  client_id: '5Op7GI36OqS4PO0hZjVM3Xe8DXHVIYm4',
  client_secret: process.env.BACKEND_AUTH0_CLIENT_SECRET,
  audience: 'https://helpers-admin-test.auth0.com/api/v2/',
  grant_type: 'client_credentials',
};

module.exports = async () => {
  const { data } = await axios.post(url, payload);
  const baseURL = 'https://helpers-admin-test.auth0.com/api/v2/';
  const auth0 = axios.create({ baseURL });

  auth0.interceptors.request.use((options) => ({
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${data.access_token}`,
    },
  }));

  return auth0;
};
