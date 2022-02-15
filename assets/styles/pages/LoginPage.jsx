import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import Field from "../components/forms/Field";
import AuthContext from "../contexts/AuthContext";
import AuthAPI from "../services/authAPI";

const LoginPage = ({ history }) => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  //Gestion des champs
  const handleChange = ({ currentTarget }) => {
    const { value, name } = currentTarget;
    setCredentials({ ...credentials, [name]: value });
  };

  //Gestion du submit
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await AuthAPI.authenticate(credentials);
      setError("");
      setIsAuthenticated(true);
      toast.success("Vous êtes désormais connecté 😄!");
      history.replace("/customers");
    } catch (error) {
      // console.log(error.response);
      setError(
        "Aucun compte ne possède cette adresse ou alors les informations ne correspondent pas 😈 !"
      );
      toast.error("Une erreur est survenue 😈");
    }

    // console.log(credentials);
  };

  return (
    <>
      <h1>Connexion !</h1>
      <form action="" onSubmit={handleSubmit}>
        <Field
          label="Adresse email"
          name="username"
          value={credentials.username}
          onChange={handleChange}
          placeholder="Adresse email de connexion ..."
          error={error}
        />
        <Field
          label="Mot de passe"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          type="password"
          error=""
        />

        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Se connecter
          </button>
        </div>
      </form>
    </>
  );
};

export default LoginPage;
