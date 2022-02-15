import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactToPrint, { useReactToPrint } from 'react-to-print';
import { toast } from 'react-toastify';
import Pagination from './Pagination';
import invoicesAPI from '../services/invoicesAPI';
//hier
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import "datatables.net-buttons/js/dataTables.buttons.js";
import "datatables.net-buttons/js/buttons.colVis.js";
import "datatables.net-buttons/js/buttons.flash.js";
import "datatables.net-buttons/js/buttons.html5.js";
import "datatables.net-buttons/js/buttons.print.js";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import $ from 'jquery';


const STATUS_CLASSES = {
    PAID: "success",
    SENT: "primary",
    CANCELLED: "danger"
};

const STATUS_LABELS = {
    PAID: "Payée",
    SENT: "Envoyée",
    CANCELLED: "Annulée"
};

const IPrint = (props) => {
    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");

    const fetchInvoices = async () => {
        try {
            const data = await invoicesAPI.findAll();
            setInvoices(data);
        } catch (error) {
            toast.error("Erreur lors du chargement des factures !");
            // console.log(error.response);
        }
    }

    useEffect(() => {
        fetchInvoices();
    }, []);

    //Gestion de changement de page
    const handlePageChange = page => setCurrentPage(page);

    //Gestion de la recherche
    const handleSearch = ({ currentTarget }) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    };

    //Gestion suppression d'un customer
    const handleDelete = async id => {
        //console.log(id);

        const originalInvoices = [...invoices];
        setInvoices(invoices.filter(invoice => invoice.id !== id));

        setInvoices(invoices.filter(invoice => invoice.id !== id));

        try {
            await invoicesAPI.delete(id)
            toast.success("La Facture a bien été supprimée !");
        } catch (error) {
            toast.error("Une erreur est survenue");
            // console.log(error.response);
            setInvoices(originalInvoices);
        }
    };



    const formatDate = (str) => moment(str).format('DD/MM/YYYY');

    //Filtrage de customers en fonction de la recherche
    const filteredInvoices = invoices.filter(
        i => i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
            i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
            i.amount.toString().includes(search.toLowerCase()) ||
            STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase()));

    //Pagination des données 
    const itemsPerPage = 10;
    const paginatedInvoices = Pagination.getdata(filteredInvoices, currentPage, itemsPerPage);

    //hier
    $(document).ready(function () {
        setTimeout(function () {
            $('#example').DataTable(
                {
                    pagingType: 'full_number',
                    pageLength: 5,
                    processing: true,
                    dom: 'Bfrtip',
                    buttons: ['copy', 'csv', 'print']
                }
            );
        }, 1000);
    });

    const componentRef = useRef()
    const handlePrint = () => {
        window.print()
    }


    return (<>
        <main className="md:max-w-4xl md:mx-auto">
        <ReactToPrint className="flex items-center bg-gray-300 text-gray-800 py-1 px-4 rounded shadow hover:bg-gray-400 transition-all duration-300"
            trigger={() => <button>imprimer</button>}
            content={() => componentRef.current}
        />
            <div ref={componentRef}>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Numéro</th>
                            <th>Client</th>
                            <th className='text-center'>Date d'envoi</th>
                            <th className='text-center'>Statut</th>
                            <th className='text-center'>Montant</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedInvoices.map(invoice => <tr key={invoice.id}>
                            <td>{invoice.chrono}</td>
                            <td>
                                <a href="#">{invoice.customer.lastName} {invoice.customer.firstName}</a>
                            </td>
                            <td className='text-center' >{formatDate(invoice.sentAt)}</td>
                            <td className='text-center'>
                                <span className={"badge badge-" + STATUS_CLASSES[invoice.status]}>{STATUS_LABELS[invoice.status]}</span>
                            </td>
                            <td className='text-center'>{invoice.amount.toLocaleString()} FCFA</td>
                        </tr>
                        )}

                    </tbody>
                </table>
            </div>
        </main>
    </>);
}

export default IPrint;