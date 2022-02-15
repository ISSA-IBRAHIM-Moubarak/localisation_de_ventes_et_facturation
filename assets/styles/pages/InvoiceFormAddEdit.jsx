import React, { useEffect, useState, createContext, useReducer } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Field from "../components/forms/Field";
import Select from "../components/forms/Select";
import invoicesAPI from "../services/invoicesAPI";
import "../components/cart.css";
import ContextCart from "./ContextCart";
import { render } from "react-dom";
import { products } from "./Products";
import { Form } from "react-bootstrap";
import { reducer } from "./reducer";
import Axios from "axios";
import useFetch from "react-fetch-hook";
import FormContentLoader from "../components/loaders/FormContentLoader";
import customersAPI from "../services/customersAPI";

export const CartContext = createContext();

const InvoiceFormAddEdit = ({ history, match }) => {
  const { id = "new" } = match.params;

  const [invoice, setInvoice] = useState({
    amount: "",
    customer: "",
    status: "SENT",
  });

  const [errors, setErrors] = useState({
    amount: "",
    customer: "",
    status: "",
  });

  const [customers, setCustomers] = useState([]);
  const [editing, setEditing] = useState(false);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Récupération des clients
  const fetchCustomer = async () => {
    try {
      const data = await customersAPI.findAll();
      setCustomers(data);
      if (!invoice.customer) setInvoice({ ...invoice, customer: data[0].id });
      setLoading(false);
      // console.log(data);
    } catch (error) {
      //console.log(error.response);
      // TODO : Notification flash d'une erreur
      toast.error("Impossible de charger les clients 😈!");
      history.replace("/invoices");
    }
  };

  //Récupération de la liste des clients à chaque chargement du composant
  useEffect(() => {
    fetchCustomer();
  }, []);

  /*const fetchArticle = async () => {
        try {
            const data = await articlesAPI.findAll();
            setArticle(data);
            if (!invoice.article) setInvoice({ ...invoice, article: data[0].id });
            // console.log(data);
        } catch (error) {
            //console.log(error.response);
            // TODO : Notification flash d'une erreur
            toast.error("Impossible de charger les clients !");
            history.replace("/invoices");
        }
    };

    //Récupération de la liste des clients à chaque chargement du composant
    useEffect(() => {
        fetchArticle();
    }, []);

    */

  // Récupération d'une facture
  const fetchInvoice = async (id) => {
    try {
      const { amount, status, customer } = await invoicesAPI.find(id);
      setInvoice({ amount, status, customer: customer.id });
      setLoading(false);
      // console.log(data);
    } catch (error) {
      toast.error("Impossible de charger la facture demandée 😈 !");
      //console.log(error.response);
      // TODO : Notification flash d'une erreur
      history.replace("/invoices");
    }
  };

  //Récupération de la bonne facture quand l'identifiant de l'URL change
  useEffect(() => {
    if (id !== "new") {
      setEditing(true);
      fetchInvoice(id);
    }
  }, [id]);

  //Gestion des changements des inputs dans  le formulaire
  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setInvoice({ ...invoice, [name]: value });
  };

  //Gestion de la soumission du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();

    //console.log(newQuantity);
    //console.log(invoice);
    try {
      if (editing) {
        await invoicesAPI.update(id, invoice);
        // console.log(response);
        // TODO : Flash notification du succès
        toast.success("La facture a bien été modifiée 👍");
        history.replace("/invoices");
      } else {
        await invoicesAPI.create(invoice);
        // TODO : Flash notification du succès
        toast.success("La facture a bien été enregistrée 👍");
        //console.log(response);
        history.replace("/invoices");
      }
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
  };

  //const dataArticle = useState(articlesAPI.findAll());
  //console.log(dataArticle)

  /* const [dataArticle, setDataArticle] = useState([]);
 
     useEffect(() => {
         const fetchData = async () => {
             const result = await articlesAPI.findAll();
             setDataArticle(result.dataArticle);
         };
         fetchData();
         []
     })
     */

  /*fetch('http://localhost:8000/api/articles').then((response) => {
        response = response.json()
        response.then((article) => {
            console.log(article)
        })
    })
    */

  /*const [item, setItem] = useState({

        title: "",
        description: "",
        price: "",
        quantity: "",
        path: ""
    });


    const initialState = async id => {
       try {
        const item = await Axios
        .get("http://localhost:8000/api/articles/" + id)
        .then(response => response.data);
        const { title, description, price, quantity, path } = item;

        setItem({ title, description, price, quantity, path});
        //console.log({ title, description, price, quantity, path});
       } catch (error) {
           console.log(error.response);
       }
    };

    initialState();
    //console.log(item)
    useEffect(() => {
        if (id !== "new") {
            initialState(id);
        }
    }, [id]);
    */

  /* const address = articlesAPI.findAll()
 
     const test = async () => {
         const item = await address;
         //console.log(item);
     };
 
     const initialState = {
         item: item,
         totalAmount: 0,
         totalItem: 0,
     };
 
 
     console.log(item)
    // console.log(initialState)
    */

  /* const [item, setItem] = useState("");
   
       useEffect(() => {
           const fetchData = async () => {
               const result = await articlesAPI.findAll();
              const { item } = result.json();
  
              setItem({ item });
          };
          fetchData();
      }, [])
      */

  /* var p = Promise.resolve(articlesAPI.findAll());
 p.then(function(v) {
   //console.log(v[1]); // 1
 });
 
    
      const initialState = {
         item: p.then(function(v) {
             return p;
           }), 
         totalAmount: 0,
         totalItem: 0,
         
     };
    
     fetch('http://localhost:8000/api/articles')
     .then(function(response) {
         //console.log(response.json() );
     })
 
     function findAll() {
         return Axios
         .get("http://localhost:8000/api/articles")
         .then(response => response.data["hydra:member"])
         .then(function(response) {
             console.log(response.json() );
         });
         //console.log(response);
     }
      */

  /*
    const [item, setItem] = useState([])
   useEffect(() => {
        Axios
        .get("http://localhost:8000/api/articles")
        .then(response => response.data["hydra:member"])
        .then(data => {
            const ok = data;
            setItem({ok})
            console.log(ok);
        })
    }, [])
    const [articles, setArticles] = useState([]);
    */

  /*
        function findAll() {
            return Axios
            .get("http://localhost:8000/api/articles")
            .then(response => response.data["hydra:member"])
            .then(data => {
                const ok = data;
                setItem({ok})
            })
            
            //console.log(response);
        }
        
        //findAll();
        //console.log(item);
    
        
        //Permet d'aller récupérer les articles
        const fetchArticles = async () => {
            
            try {
                const data = await articlesAPI.findAll()
                //console.log(data);
                setArticles(data);
            } catch (error) {
                //console.log(error.response);
                toast.error("Impossible de charger les clients");
    
            }
        };
    
        //Au chargment du composant, on va chercher les articles
        useEffect(() => { fetchArticles(); }, []);
        
        */

  //console.log(originalArticles);

  /* useEffect(() => {
         Axios
         .get("http://localhost:8000/api/articles")
         .then(response => response.data["hydra:member"])
         .then(data => setArticles(data))
      }, []) 
      */
  // console.log(articles);

  // const {data} = useFetch("https://api-sta2.herokuapp.com/article");
  //console.log(data);

  //Permet d'aller récupérer les articles
  const fetchArticles = async () => {
    try {
      const data = await articlesAPI.findAll();
      //console.log(data);
      setArticles(data);
    } catch (error) {
      //console.log(error.response);
      // toast.error("Impossible de charger les produits");
    }
  };

  //Au chargment du composant, on va chercher les articles
  useEffect(() => {
    fetchArticles();
  }, []);
  console.log(articles);

  const initialState = {
    item: products,
    totalAmount: 0,
    totalItem: 0,
  };
  console.log(initialState);

  const [state, dispatch] = useReducer(reducer, initialState);

  // to delete the indv. elements from an Item Cart
  const removeItem = (id) => {
    return dispatch({
      type: "REMOVE_ITEM",
      payload: id,
    });
  };

  // clear the cart
  const clearCart = () => {
    return dispatch({ type: "CLEAR_CART" });
  };

  // increment the item
  const increment = (id) => {
    return dispatch({
      type: "INCREMENT",
      payload: id,
    });
  };

  // decrement the item
  const decrement = (id) => {
    return dispatch({
      type: "DECREMENT",
      payload: id,
    });
  };

  // we will use the useEffect to update the data
  useEffect(() => {
    dispatch({ type: "GET_TOTAL" });
  }, [state.item]);

  return (
    <>
      {editing &&
        (<h1>Modification de la facture</h1> || <h1>Création des factures</h1>)}
      {loading && <FormContentLoader />}
      {!loading && (
        <form onSubmit={handleSubmit}>
          <Select
            name="customer"
            label="Client"
            value={invoice.customer}
            error={errors.customer}
            onChange={handleChange}
          >
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.lastName} {customer.firstName}
              </option>
            ))}
          </Select>
          <Select
            name="status"
            label="Statut de la facture"
            value={invoice.status}
            error={errors.status}
            onChange={handleChange}
          >
            <option value="SENT">Envoyé</option>
            <option value="PAID">Payée</option>
            <option value="CANCELLED">Annulée</option>
          </Select>
          <CartContext.Provider
            value={{ ...state, removeItem, clearCart, increment, decrement }}
          >
            <ContextCart />
          </CartContext.Provider>

          <Field
            name="amount"
            label="Confirmer le montant"
            type="number"
            placeholder="Montant de la facture"
            value={invoice.amount}
            onChange={handleChange}
            error={errors.amount}
          />

          <div className="from-group mt-3">
            <button type="submit" className="btn btn-success">
              Enregistrer
            </button>
            <Link to="/invoices" className="btn btn-link">
              Retour à la liste
            </Link>
          </div>
        </form>
      )}
    </>
  );
};

export default InvoiceFormAddEdit;
