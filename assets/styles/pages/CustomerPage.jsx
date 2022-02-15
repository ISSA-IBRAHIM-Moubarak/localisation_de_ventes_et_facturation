import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import TableLoader from "../components/loaders/TableLoader";
import Pagination from "../components/Pagination";
import customersAPI from "../services/customersAPI";

const CustomerPage = (props) => {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  //Permet d'aller récupérer les customers
  const fetchCustomers = async () => {
    try {
      const data = await customersAPI.findAll();
      setCustomers(data);
      setLoading(false);
    } catch (error) {
      toast.error("Impossible de charger les clients 😈");
      //console.log(error.response);
    }
  };

  //Au chargment du composant, on va chercher les customers
  useEffect(() => {
    fetchCustomers();
  }, []);

  //Gestion suppression d'un customer
  const handleDelete = async (id) => {
    //console.log(id);

    const originalCustomers = [...customers];
    setCustomers(customers.filter((customer) => customer.id !== id));

    try {
      await customersAPI.delete(id);
      toast.success("Le client a bien été supprimé 👍");
    } catch (error) {
      setCustomers(originalCustomers);
      toast.success("La suppression du client n'a pas pu effectuer 😈");
    }
  };

  //Gestion de changement de page
  const handlePageChange = (page) => setCurrentPage(page);

  //Gestion de la recherche
  const handleSearch = ({ currentTarget }) => {
    setSearch(currentTarget.value);
    setCurrentPage(1);
  };

  //Filtrage de customers en fonction de la recherche
  const filteredCustomers = customers.filter(
    (c) =>
      c.firstName.toLowerCase().includes(search.toLowerCase()) ||
      c.lastName.toLowerCase().includes(search.toLowerCase()) ||
      c.contact.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  //console.log(pages);
  //Pagination des données
  const itemsPerPage = 10;
  const paginatedCustomers = Pagination.getdata(
    filteredCustomers,
    currentPage,
    itemsPerPage
  );
  return (
    <>
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <h1>Liste des clients</h1>
        <Link to="customers/new" className="btn btn-primary">
          Créer un client
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
            <th>Client</th>
            <th>Téléphone</th>
            <th>Email</th>
            <th className="text-center">Facture</th>
            <th className="text-center">Montant total</th>
            <th />
          </tr>
        </thead>
        {!loading && (
          <tbody>
            {paginatedCustomers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>
                  <Link to={"/customers/" + customer.id}>
                    {customer.lastName} {customer.firstName}
                  </Link>
                </td>
                <td>{customer.contact}</td>
                <td>{customer.email}</td>
                <td className="text-center">
                  <span className="badge badge-ligth">
                    {customer.invoices.length}
                  </span>
                </td>
                <td className="text-center">
                  {customer.totalAmount.toLocaleString()} FCFA
                </td>
                <td>
                  <Link
                    to={"/customers/" + customer.id}
                    className="btn btn-sm btn-primary mr-1"
                  >
                    Editer
                  </Link>
                  &nbsp;
                  <button
                    onClick={() => handleDelete(customer.id)}
                    disabled={customer.invoices.length > 0}
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
      {itemsPerPage < filteredCustomers.length && (
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          length={filteredCustomers.length}
          onPageChanged={handlePageChange}
        />
      )}
    </>
  );
};

export default CustomerPage;
