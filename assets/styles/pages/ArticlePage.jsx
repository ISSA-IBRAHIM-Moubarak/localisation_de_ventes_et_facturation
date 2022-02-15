import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "../components/Pagination";
import articlesAPI from "../services/articlesAPI";
import { toast } from "react-toastify";
import TableLoader from "../components/loaders/TableLoader";

const ArticlePage = (props) => {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  //Permet d'aller récupérer les articles
  const fetchArticles = async () => {
    try {
      const data = await articlesAPI.findAll();
      //console.log(data);
      setArticles(data);
      setLoading(false);
    } catch (error) {
      //console.log(error.response);
      toast.error("Impossible de charger les articles 😈");
    }
  };

  //Au chargment du composant, on va chercher les articles
  useEffect(() => {
    fetchArticles();
  }, []);

  //Gestion suppression d'un article
  const handleDelete = async (id) => {
    //console.log(id);

    const originalArticles = [...articles];
    setArticles(articles.filter((article) => article.id !== id));

    try {
      await articlesAPI.delete(id);
      toast.success("Le produit a bien été supprimé 👍");
    } catch (error) {
      setArticles(originalArticles);
      toast.success("La suppression du produit n'a pas pu effectuer 😈");
    }
  };

  //Gestion de changement de page
  const handlePageChange = (page) => setCurrentPage(page);

  //Gestion de la recherche
  const handleSearch = ({ currentTarget }) => {
    setSearch(currentTarget.value);
    setCurrentPage(1);
  };

  const itemsPerPage = 10;

  //Filtrage de articles en fonction de la recherche
  const filteredArticles = articles.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.price.toString().includes(search.toLowerCase())
  );

  //console.log(pages);
  //Pagination des données
  const paginatedArticles = Pagination.getdata(
    filteredArticles,
    currentPage,
    itemsPerPage
  );
  //console.log(paginatedArticles)
  return (
    <>
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <h1>Liste des articles</h1>
        <Link to="articles/new" className="btn btn-primary">
          Créer un article
        </Link>
      </div>

      <div className="form-group">
        <input
          type="text"
          onChange={handleSearch}
          value={search}
          className="form-control"
          placeholder="Rechercher ..."
        />
      </div>

      <table className="table table-hover">
        <thead>
          <tr>
            <th>Id.</th>
            <th>Libellé</th>
            <th>Description</th>
            <th className="text-center">Prix Unitaire</th>
            <th />
          </tr>
        </thead>
        {!loading && (
          <tbody>
            {paginatedArticles.map((article) => (
              <tr key={article.id}>
                <td>{article.id}</td>
                <td>
                  <Link to={"/articles/" + article.id}>{article.title}</Link>
                </td>
                <td>{article.description}</td>
                <td className="text-center">
                  {article.price.toLocaleString()} FCFA
                </td>
                <td>
                  <Link
                    to={"/articles/" + article.id}
                    className="btn btn-sm btn-primary mr-1"
                  >
                    Editer
                  </Link>
                  &nbsp;
                  <button
                    onClick={() => handleDelete(article.id)}
                    disabled={article.length > 0}
                    className="btn btn-sm btn-danger"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
      {loading && <TableLoader />}
      {itemsPerPage < filteredArticles.length && (
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          length={filteredArticles.length}
          onPageChanged={handlePageChange}
        />
      )}
    </>
  );
};

export default ArticlePage;
