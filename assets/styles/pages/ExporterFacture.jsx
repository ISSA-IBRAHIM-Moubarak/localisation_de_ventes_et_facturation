import moment from 'moment';
import './FactureIndividuel.css';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import invoicesAPI from '../services/invoicesAPI';
import { PDFExport, savePDF } from '@progress/kendo-react-pdf';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Button } from 'react-bootstrap';



const ExporterFacture = (props) => {

    const pdfExportComponent = useRef(null);
    const [layoutSelection, setLayoutSelection] = useState({ text: "A4", value: "size-a4" });

    const ddData = [{ text: "A4", value: "size-a4" },
    { text: "Letter", value: "size-letter" },
    { text: "Executive", value: "size-executive" }
    ];

    const handleExportWithComponent = (event) => {
        pdfExportComponent.current.save();
    }

    const updatePageLayout = (event) => {
        setLayoutSelection(event.target.value);
    }

    const [invoices, setInvoices] = useState([]);

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


    const formatDate = (str) => moment(str).format('DD/MM/YYYY');

    return (<>
        <div className="box wide hidden-on-narrow">
            <div className="box-col">
                <h4>Select a Page Size</h4>
                <DropDownList
                    data={ddData}
                    textField="text"
                    dataItemKey="value"
                    value={layoutSelection}
                    onChange={updatePageLayout}
                >
                </DropDownList>
            </div>
            <div className="box-col">
                <Button primary={true} onClick={handleExportWithComponent}>Imprimer</Button>
               
            </div>
        </div>
        &nbsp;
        <div className="page-container hidden-on-narrow">
            <PDFExport ref={pdfExportComponent}>
                <div className={`pdf-page ${layoutSelection.value}`}>
                    <div className="inner-page">
                        <div className="pdf-header">
                            <span className="company-logo">Société de Transformations Alimentaires</span>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <span className="invoice-number">Facture N°</span>
                        </div>
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
                                {invoices.map(invoice => <tr key={invoice.id}>
                                    <td>{invoice.chrono}</td>
                                    <td>
                                        <a href="#">{invoice.customer.lastName} {invoice.customer.firstName}</a>
                                    </td>
                                    <td className='text-center' >{formatDate(invoice.sentAt)}</td>
                                    <td className='text-center'>
                                        <span>{invoice.status}</span>
                                    </td>
                                    <td className='text-center'>{invoice.amount.toLocaleString()} FCFA</td>
                                </tr>
                                )}

                            </tbody>
                        </table>
                        <div className="pdf-body">
                            <div id="grid"></div>
                            <p className="signature">
                                Signature: ________________ <br /> <br />
                                Date:
                            </p>
                        </div>
                    </div>
                </div>
            </PDFExport>
        </div>
    </>);
}

export default ExporterFacture;