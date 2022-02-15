import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import AuthContext from "../contexts/AuthContext";
import authAPI from "../services/authAPI";

const Navbar = ({ history }) => {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  const handleLogout = () => {
    authAPI.logout();
    setIsAuthenticated(false);
    toast.info("Vous êtes désormais déconnecté 😄 ");
    history.push("/login");
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.0/css/all.min.css"
          integrity="sha512-BnbUDfEUfV0Slx6TunuB042k9tuKe3xrD6q4mg5Ed72LTgzDIcLPxg6yI2gcMFRyomt+yJJxE+zJwNmxki6/RA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">
          Nasty
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarColor01"
          aria-controls="navbarColor01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarColor03">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/customers">
                Client
              </NavLink>
            </li>
            {/*<li className="nav-item">
                        <NavLink className="nav-link" to="/carte">Carte Géographique</NavLink>
                    </li>*/}
            <li className="nav-item">
              <NavLink className="nav-link" to="/invoices">
                Facture
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/articles">
                Aritcle
              </NavLink>
            </li>
          </ul>
          <ul className="navbar-nav ml-auto">
            {(!isAuthenticated && (
              <>
                <li className="nav-item">
                  <NavLink to="/register" className="nav-link">
                    Inscription
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/login" className="btn btn-success">
                    Connexion !
                  </NavLink>
                </li>
              </>
            )) || (
              <li className="nav-item">
                <button
                  onClick={handleLogout}
                  href="#"
                  className="btn btn-danger"
                >
                  Déconnexion
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
