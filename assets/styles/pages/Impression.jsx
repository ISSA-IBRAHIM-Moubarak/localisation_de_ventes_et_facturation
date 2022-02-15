import jsPDF from 'jspdf';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactToPrint, { useReactToPrint } from 'react-to-print';
import { toast } from 'react-toastify';
import Pagination from '../components/Pagination';
import invoicesAPI from '../services/invoicesAPI';
import { FaPrint, FaDownload } from "react-icons/fa";
import { PDFExport, savePDF } from '@progress/kendo-react-pdf';
import './FactureIndividuel.css';
import DatePicker from 'react-datepicker';
import TableLoader from '../components/loaders/TableLoader';



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

const InvoicesPage = (props) => {
    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);

    /* const [dateStart, setDateStart] = useState(null);
     const [dateEnd, setDateEnd] = useState(null);
     
     const fetchDateStart = async () => {
         try {
             const formatDate = (str) => moment(str).format('DD/MM/YYYY');
             const { sentAt } = await invoicesAPI.findAll();
             setDateStart(formatDate({sentAt}));
         } catch (error) {
             toast.error("Impossible de rechercher la date !");
             console.log(error.response);
         }
     }
 
     //Récupération de la bonne facture quand l'identifiant de l'URL change 
     useEffect(() => {
         fetchDateStart();
     }, []);
 
     */


    const fetchInvoices = async () => {
        try {
            const data = await invoicesAPI.findAll();
            setInvoices(data);
            setLoading(false);
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
            i.sentAt.toString().includes(search.toLowerCase()) ||
            STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase()));

    //Pagination des données 
    const itemsPerPage = 10;
    const paginatedInvoices = Pagination.getdata(filteredInvoices, currentPage, itemsPerPage);

    const componentRef = useRef()
    const pdfExportComponent = useRef(null);


    return (<>
        <div className="form-group">
            <input type="text" onChange={handleSearch} value={search} className="form-control" placeholder="Rechercher ..." />
        </div>
        {/*<DatePicker 
        selected={dateStart}
        onChange={date => setDateStart(date)}
        />*/}
        <br />
        <div className="mb-3 d-flex justify-content-between">
            <ReactToPrint
                trigger={() => <button className="btn btn-success">imprimer <FaPrint className="ml-2" /></button>}
                content={() => componentRef.current}
            />
        </div>
        <div ref={componentRef}>
            <PDFExport ref={pdfExportComponent}>
                <div className="inner-page">
                    <div className="my-5 d-flex justify-content-between align-items-center">
                        <h1>Liste des Factures</h1>
                        <h1>Facture N°________</h1>
                    </div>
                    <br />
                    <br />
                    <br />
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Client</th>
                                <th className='text-center'>Date d'envoi</th>
                                <th className='text-center'>Statut</th>
                                <th className='text-center'>Montant</th>
                                <th className='text-center'>Commentaire</th>
                                <th></th>
                            </tr>
                        </thead>
                        {!loading && <tbody>
                            {paginatedInvoices.map(invoice => <tr key={invoice.id}>
                                <td>
                                    <Link to={"/customers/" + invoice.customer.id}>{invoice.customer.lastName} {invoice.customer.firstName}</Link>
                                </td>
                                <td className='text-center' >{formatDate(invoice.sentAt)}</td>
                                <td className='text-center'>
                                    <span className={"badge badge-" + STATUS_CLASSES[invoice.status]}>{STATUS_LABELS[invoice.status]}</span>


                                </td>
                                <td className='text-center'>{invoice.amount.toLocaleString()} FCFA</td>
                                <td className='text-center'></td>
                            </tr>
                            )}
                        </tbody>}
                    </table>
                    {loading && <TableLoader />}
                    <div className="pdf-body">
                        <div id="grid"></div>
                        <p className="signature">
                            Signature: ________________ <br />
                            <br />
                            Date:
                        </p>
                    </div>
                </div>
            </PDFExport>
        </div>
        <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} length={filteredInvoices.length} onPageChanged={handlePageChange} />

    </>);
}

export default InvoicesPage;