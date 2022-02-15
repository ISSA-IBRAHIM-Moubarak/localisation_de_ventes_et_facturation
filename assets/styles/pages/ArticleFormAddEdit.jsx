import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Field from "../components/forms/Field";
import FormContentLoader from "../components/loaders/FormContentLoader";
import articlesAPI from "../services/articlesAPI";

const ArticleFormAddEdit = ({ match, history }) => {
  const { id = "new" } = match.params;

  const [article, setArticle] = useState({
    title: "",
    price: "",
    description: "",
    quantity: 1,
    path: "",
  });

  const [errors, setErrors] = useState({
    title: "",
    price: "",
    description: "",
    quantity: 1,
    path: "",
  });

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  //Récupération du article en fonction de l'identifiant

  const fetchArticle = async (id) => {
    try {
      const { title, price, description, quantity, path } =
        await articlesAPI.find(id);
      setArticle({ title, price, description, quantity, path });
      setLoading(false);
      // console.log(data);
    } catch (error) {
      //console.log(error.response);
      // TODO : Notification flash d'une erreur
      toast.error("Impossible de charger les factures 😈!");
      history.replace("/articles");
    }
  };

  //Chargement du article si besion au chargement du composant ou au chargement de l'idenfitifiant
  useEffect(() => {
    if (id !== "new") {
      setLoading(true);
      setEditing(true);
      fetchArticle(id);
    }
  }, [id]);

  //Gestion des changements des inputs dans  le formulaire
  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setArticle({ ...article, [name]: value });
  };

  //Gestion de la soumission du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();
    //console.log(article);
    try {
      if (editing) {
        await articlesAPI.update(id, article);
        // TODO : Flash notification du succès
        toast.success("Le produit a bien été modifiée 👍");
        // console.log(data);
        history.replace("/articles");
      } else {
        await articlesAPI.create(article);
        // TODO : Flash notification du succès
        toast.success("Le produit a bien été enregistrée 👍");
        //console.log(response);

        history.replace("/articles");
      }
      //console.log(response.data);
      setErrors({});
    } catch ({ response }) {
      const { violations } = response.data;
      if (violations) {
        const apiErrors = {};
        violations.forEach(({ propertyfile, message }) => {
          apiErrors[propertyfile] = message;
        });
        setErrors(apiErrors);
        // TODO : Flash notification d'erreurs
        toast.error("Des erreurs dans votre formulaire 📝");
      }
    }
    //console.log(article);
  };

  return (
    <>
      {(editing && <h1>Modification du produit</h1>) || (
        <h1>Création d'un produit</h1>
      )}
      {loading && <FormContentLoader />}
      {!loading && (
        <form onSubmit={handleSubmit}>
          <Field
            name="title"
            label="Libellé"
            placeholder="Nom du produit"
            value={article.title}
            onChange={handleChange}
            error={errors.title}
          />
          <Field
            name="description"
            label="description"
            placeholder="La description du produit"
            value={article.description}
            onChange={handleChange}
            error={errors.description}
          />
          <Field
            name="price"
            label="Prix unitaire"
            placeholder="Le prix unitaire du produit"
            type="number"
            value={article.price}
            onChange={handleChange}
            error={errors.price}
          />

          <label>
            Ajouter une photo:
            <input type="file" name="path" />
          </label>

          <div className="from-group mt-3">
            <button type="submit" className="btn btn-success">
              Enregistrer
            </button>
            <Link to="/articles" className="btn btn-link">
              Retour à la liste
            </Link>
          </div>
        </form>
      )}
    </>
  );
};

export default ArticleFormAddEdit;
