import Axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Field from "../components/forms/Field";
import usersAPI from "../services/usersAPI";

const RegisterPage = ({ history }) => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirme: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirme: "",
  });

  //Gestion des changements des inputs dans  le formulaire
  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setUser({ ...user, [name]: value });
  };

  //Gestion de la soumission du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();

    const apiErrors = {};
    if (user.password !== user.passwordConfirme) {
      apiErrors.passwordConfirme = "Veuillez saisir le même mot de passe";
      setErrors(apiErrors);
      toast.error("Des erreurs dans votre formulaire 📝");
      return;
    }

    try {
      await usersAPI.register(user);
      setErrors({});
      // TODO: Flash succes
      toast.success(
        "Vous êtes désormais inscrit, vous pouvez vous connectez 😃!"
      );
      history.replace("/login");
      // console.log(response);
    } catch (error) {
      //console.log(error.response);
      const { violations } = error.response.data;

      if (violations) {
        violations.forEach((violation) => {
          apiErrors[violation.propertyPath] = violation.message;
        });
        setErrors(apiErrors);
      }
      // TODO: Flash erreur
      toast.error("Des erreurs dans votre formulaire 📝");
    }
    //console.log(user);
  };
  return (
    <>
      <h1>Inscription</h1>
      <form onSubmit={handleSubmit}>
        <Field
          name="firstName"
          label="Prénom"
          placeholder="Votre prénom"
          value={user.firstName}
          onChange={handleChange}
          error={errors.firstName}
        />
        <Field
          name="lastName"
          label="Nom de famille"
          placeholder="Votre nom de famille"
          value={user.lastName}
          onChange={handleChange}
          error={errors.lastName}
        />
        <Field
          name="email"
          label="Adresse email"
          placeholder="Votre adresse email"
          value={user.email}
          onChange={handleChange}
          error={errors.email}
          type="email"
        />
        <Field
          name="password"
          label="Mot de passe"
          placeholder="Votre mot de passe"
          value={user.password}
          onChange={handleChange}
          error={errors.password}
          type="password"
        />
        <Field
          name="passwordConfirme"
          label="Confirmation de mot de passe"
          placeholder="Confirmer votre mot de passe"
          value={user.passwordConfirme}
          onChange={handleChange}
          error={errors.passwordConfirme}
          type="password"
        />
        <div className="from-group mt-3">
          <button type="submit" className="btn btn-success">
            Valider
          </button>
          <Link to="/login" className="btn btn-link">
            J'ai déjà un compte
          </Link>
        </div>
      </form>
    </>
  );
};

export default RegisterPage;
