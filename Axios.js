import axios from 'axios';
// import axios from './node_modules/axios';
// import { BASE_URL } from './baseUrl'; // Import the base URL from the separate file

const Axios = axios.create({
  baseURL: "https://localhost:44359/api/"
});

export default Axios;
