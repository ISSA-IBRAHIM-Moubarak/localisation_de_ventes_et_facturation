import Axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Field from "../components/forms/Field";
import FormContentLoader from "../components/loaders/FormContentLoader";
import customersAPI from "../services/customersAPI";

const CustomerFormAjout = ({ match, history }) => {
  const { id = "new" } = match.params;

  const [customer, setCustomer] = useState({
    lastName: "",
    firstName: "",
    email: "",
    contact: "",
  });

  const [errors, setErrors] = useState({
    lastName: "",
    firstName: "",
    email: "",
    contact: "",
  });

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  //Récupération du customer en fonction de l'identifiant

  const fetchCustomer = async (id) => {
    try {
      const { firstName, lastName, email, contact } = await customersAPI.find(
        id
      );
      // console.log(data);
      setCustomer({ firstName, lastName, email, contact });
      setLoading(false);
    } catch (error) {
      //console.log(error.response);
      // TODO : Notification flash d'une erreur
      history.replace("/customers");
      toast.error("Impossible de charger les clients 😈!");
    }
  };

  //Chargement du customer si besion au chargement du composant ou au chargement de l'idenfitifiant
  useEffect(() => {
    if (id !== "new") {
      setLoading(true);
      setEditing(true);
      fetchCustomer(id);
    }
  }, [id]);

  //Gestion des changements des inputs dans  le formulaire
  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setCustomer({ ...customer, [name]: value });
  };

  //Gestion de la soumission du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editing) {
        await customersAPI.update(id, customer);
        // TODO : Flash notification du succès
        // console.log(data);
        toast.success("Le client a bien été modifiée 👍");
        history.replace("/customers");
      } else {
        await customersAPI.create(customer);
        // TODO : Flash notification du succès
        toast.success("Le client a bien été enregistrée 👍");
        history.replace("/customers");
      }
      setErrors({});
      //console.log(response.data);
    } catch ({ response }) {
      const { violations } = response.data;
      if (violations) {
        const apiErrors = {};
        violations.forEach(({ propertyPath, message }) => {
          apiErrors[propertyPath] = message;
        });
        setErrors(apiErrors);
        // TODO : Flash notification d'erreurs
        toast.error("Des erreurs dans votre formulaire 📝");
      }
    }
    //console.log(customer);
  };

  return (
    <>
      {(!editing && <h1>Création d'un client</h1>) || (
        <h1>Modification du client</h1>
      )}
      {loading && <FormContentLoader />}
      {!loading && (
        <form onSubmit={handleSubmit}>
          <Field
            name="lastName"
            label="Nom de famille"
            placeholder="Nom de famille du client"
            value={customer.lastName}
            onChange={handleChange}
            error={errors.lastName}
          />
          <Field
            name="firstName"
            label="Prénom"
            placeholder="Prénom du client"
            value={customer.firstName}
            onChange={handleChange}
            error={errors.firstName}
          />
          <Field
            name="email"
            label="Email"
            placeholder="Adresse email du client"
            type="email"
            value={customer.email}
            onChange={handleChange}
            error={errors.email}
          />
          <Field
            name="contact"
            label="Téléphone"
            placeholder="Contact du client"
            value={customer.contact}
            onChange={handleChange}
            type="number"
            error={errors.contact}
          />
          <div className="from-group mt-3">
            <button type="submit" className="btn btn-success">
              Enregistrer
            </button>
            <Link to="/customers" className="btn btn-link">
              Retour à la liste
            </Link>
          </div>
        </form>
      )}
    </>
  );
};

export default CustomerFormAjout;
