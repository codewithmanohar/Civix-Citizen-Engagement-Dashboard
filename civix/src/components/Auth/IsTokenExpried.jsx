import {jwtDecode} from "jwt-decode";

const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // seconds
    return decoded.exp < currentTime; // true = expired
  } catch (error) {
    return true; // invalid token
  }
};

export default isTokenExpired; 