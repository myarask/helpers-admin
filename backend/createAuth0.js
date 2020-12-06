const dotenv = require('dotenv');
const path = require('path');
const axios = require('axios');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const payload = {
  client_id: process.env.BACKEND_AUTH0_CLIENT_ID,
  client_secret: process.env.BACKEND_AUTH0_CLIENT_SECRET,
  audience: process.env.BACKEND_AUTH0_AUDIENCE,
  grant_type: 'client_credentials',
};

module.exports = async () => {
  const { data } = await axios
    .post(process.env.BACKEND_AUTH0_TOKEN_URL, payload)
    .catch(console.error);
  const baseURL = process.env.BACKEND_AUTH0_AUDIENCE;
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
