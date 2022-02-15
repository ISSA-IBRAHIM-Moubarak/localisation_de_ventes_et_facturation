import './FactureIndividuel.css';
import STALogo from './sta.jpg';
import React from 'react'

import {
	Chart,
	ChartLegend,
	ChartSeries,
	ChartSeriesItem,
	ChartSeriesLabels,
	ChartCategoryAxis,
	ChartCategoryAxisItem
} from '@progress/kendo-react-charts';
import 'hammerjs';
import { Button } from '@progress/kendo-react-buttons';
import { PDFExport, savePDF } from '@progress/kendo-react-pdf';
import { DropDownList } from '@progress/kendo-react-dropdowns';

import sampleData from './invoice-data.json';
import { useRef, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import customersApi from '../services/customersApi';
import Axios from 'axios';



const FactureIndividuel = ({firtsName, lastName, contact}) => {
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

	const [customers, setCustomers] = useState([]);

	useEffect(() => {
        Axios
        .get("http://localhost:8000/api/customers")
        .then(response => response.data["hydra:member"])
        .then(data => setCustomers(data))
    }, []) 	
	console.log(customers);

	return (
		<div id="example">
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
					<h4>Export PDF</h4>
					<Button primary={true} onClick={handleExportWithComponent}>Export</Button>
				</div>
			</div>
			<div className="page-container hidden-on-narrow">
				<PDFExport ref={pdfExportComponent}>
					<div className={`pdf-page ${layoutSelection.value}`}>
						<div className="inner-page">
							<div className="pdf-header">
								<span className="company-logo">Société de Transformations Alimentaires</span>
								<span className="invoice-number">Invoice #23543</span>
							</div>
							<div className="pdf-footer">
								<p>
									Blauer See Delikatessen<br />
									Lützowplatz 456<br />
									Berlin, Germany,  10785
								</p>
							</div>
							<div className="addresses">
								<div className="for">
									<h3>FactureIndividuel pour</h3>
									<p>
										{firtsName}<br />
										{lastName}<br />
										{contact}
									</p>
								</div>

								<div className="from">
									<h3>De</h3>
									<p>
										Hanna Moos <br />
										Lützowplatz 456<br />
										Berlin, Germany,  10785
									</p>
									<p>
										Invoice ID: 23543<br />
										Invoice Date: 12.03.2014<br />
										Due Date: 27.03.2014
									</p>
								</div>
							</div>
							<div className="pdf-chart">
								<Chart style={{ height: 280 }}>
									<ChartSeries>
										<ChartSeriesItem
											type="donut"
											data={sampleData}
											categoryField="product"
											field="share"
										>
											<ChartSeriesLabels
												color="#fff"
												background="none"
											/>
										</ChartSeriesItem>
									</ChartSeries>
								</Chart>
							</div>
							<div className="pdf-body">
								<div id="grid"></div>
								<p className="signature">
									Signature: ________________ <br /><br />
									Date: 12.03.2014
								</p>
							</div>
						</div>
					</div>
				</PDFExport>
			</div>
		</div>
	);
}

export default FactureIndividuel;