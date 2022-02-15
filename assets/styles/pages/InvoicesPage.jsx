import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import TableLoader from "../components/loaders/TableLoader";
import Pagination from "../components/Pagination";
import invoicesAPI from "../services/invoicesAPI";

const STATUS_CLASSES = {
  PAID: "success",
  SENT: "primary",
  CANCELLED: "danger",
};

const STATUS_LABELS = {
  PAID: "Payée",
  SENT: "Envoyée",
  CANCELLED: "Annulée",
};

const InvoicesPage = (props) => {
  const [invoices, setInvoices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchInvoices = async () => {
    try {
      const data = await invoicesAPI.findAll();
      setInvoices(data);
      setLoading(false);
    } catch (error) {
      toast.error("Erreur lors du chargement des factures 😈!");
      // console.log(error.response);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  //Gestion de changement de page
  const handlePageChange = (page) => setCurrentPage(page);

  //Gestion de la recherche
  const handleSearch = ({ currentTarget }) => {
    setSearch(currentTarget.value);
    setCurrentPage(1);
  };

  //Gestion suppression d'un customer
  const handleDelete = async (id) => {
    //console.log(id);

    const originalInvoices = [...invoices];
    setInvoices(invoices.filter((invoice) => invoice.id !== id));

    setInvoices(invoices.filter((invoice) => invoice.id !== id));

    try {
      await invoicesAPI.delete(id);
      toast.success("La Facture a bien été supprimée 👍!");
    } catch (error) {
      toast.error("Une erreur est survenue 👎");
      // console.log(error.response);
      setInvoices(originalInvoices);
    }
  };

  const formatDate = (str) => moment(str).format("DD/MM/YYYY");

  //Filtrage de customers en fonction de la recherche
  const filteredInvoices = invoices.filter(
    (i) =>
      i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
      i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
      i.amount.toString().includes(search.toLowerCase()) ||
      STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase())
  );

  //Pagination des données
  const itemsPerPage = 10;
  const paginatedInvoices = Pagination.getdata(
    filteredInvoices,
    currentPage,
    itemsPerPage
  );
  return (
    <>
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <h1>Liste des Factures</h1>
        <Link to={"impression"} className="btn btn-success">
          Impression
        </Link>
        <Link to="invoices/new" className="btn btn-primary">
          Créer une facture
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
            <th>Numéro</th>
            <th>Client</th>
            <th className="text-center">Date d'envoi</th>
            <th className="text-center">Statut</th>
            <th className="text-center">Montant</th>
            <th></th>
          </tr>
        </thead>
        {!loading && (
          <tbody>
            {paginatedInvoices.map((invoice) => (
              <tr key={invoice.id}>
                <td>{invoice.chrono}</td>
                <td>
                  <Link to={"/customers/" + invoice.customer.id}>
                    {invoice.customer.lastName} {invoice.customer.firstName}
                  </Link>
                </td>
                <td className="text-center">{formatDate(invoice.sentAt)}</td>
                <td className="text-center">
                  <span
                    className={"badge badge-" + STATUS_CLASSES[invoice.status]}
                  >
                    {STATUS_LABELS[invoice.status]}
                  </span>
                </td>
                <td className="text-center">
                  {invoice.amount.toLocaleString()} FCFA
                </td>
                <td>
                  <Link
                    to={"/invoices/" + invoice.id}
                    className="btn btn-sm btn-primary mr-1"
                  >
                    Editer
                  </Link>
                  &nbsp;
                  <button
                    onClick={() => handleDelete(invoice.id)}
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
      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        length={filteredInvoices.length}
        onPageChanged={handlePageChange}
      />
    </>
  );
};

export default InvoicesPage;
