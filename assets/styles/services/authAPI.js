import Axios from "axios";
import jwtDecode from "jwt-decode";
import { LOGIN_API } from "../../config";

function logout() {
  window.localStorage.removeItem("authToken");
  delete Axios.defaults.headers["Authorization"];
}

function authenticate(credentials) {
  return Axios.post(LOGIN_API, credentials)
    .then((response) => response.data.token)
    .then((token) => {
      //Je stocke le token dans mon localStorage
      window.localStorage.setItem("authToken", token);
      //On prévient Axois qu'on n'a maintenant un header par defaut sur toutes nos futures requêtes HTTP
      setAxiosToken(token);
    });
}

function setAxiosToken(token) {
  Axios.defaults.headers["Authorization"] = "Bearer " + token;
}

function setup() {
  //1. Voir si on a un token ?
  const token = window.localStorage.getItem("authToken");

  //2. Si le token est encore valide
  if (token) {
    const { exp: expiration } = jwtDecode(token);
    if (expiration * 1000 > new Date().getTime()) {
      setAxiosToken(token);
      // console.log("ok");
    }
    //console.log(jwtData.exp * 1000, new Date().getTime());
  }
}

function isAuthenticated() {
  //1. Voir si on a un token ?
  const token = window.localStorage.getItem("authToken");

  //2. Si le token est encore valide
  if (token) {
    const { exp: expiration } = jwtDecode(token);
    if (expiration * 1000 > new Date().getTime()) {
      return true;
    }

    return false;
  }
  return false;
}

export default {
  authenticate,
  logout,
  setup,
  isAuthenticated,
};
