import axios from "axios";

const clientserver = axios.create({
  baseURL: "http://localhost:5000",
});
export { clientserver as clientServer };
