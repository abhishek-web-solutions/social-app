import axios from "axios";

const clientserver = axios.create({
  baseURL: " https://social-app-j6oo.onrender.com/",
});
export { clientserver as clientServer };

