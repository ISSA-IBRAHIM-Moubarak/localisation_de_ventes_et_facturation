import React, { useContext, useEffect, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import Items from "./Items";
import { CartContext } from "./InvoiceFormAddEdit";
import articlesAPI from "../services/articlesAPI";
import { toast } from "react-toastify";

const ContextCart = () => {
  const { item, clearCart, totalItem, totalAmount } = useContext(CartContext);

  // const [dataArticle, setDataArticle] = useState([]);
  const [articles, setArticles] = useState([]);

  //Permet d'aller récupérer les articles
  const fetchArticles = async () => {
    try {
      const data = await articlesAPI.findOtherData();
      //console.log(data);
      setArticles(data);
    } catch (error) {
      //console.log(error.response)
    }
  };

  //Au chargment du composant, on va chercher les articles
  useEffect(() => {
    fetchArticles();
  }, []);

  if (item.length === 0) {
    return (
      <>
        <section className="main-cart-section">
          <div className="cart-icon">
            <img src="./images/cart.png" alt="cart" />
            <p>0</p>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="main-cart-section">
        <div className="cart-icon">
          <img src="./images/cart.png" alt="cart" />
          <p>{totalItem}</p>
        </div>
        <div className="cart-items">
          <div className="cart-items-container">
            <Scrollbars>
              {item.map((curItme) => {
                return <Items key={curItme.id} {...curItme} />;
              })}
            </Scrollbars>
          </div>
        </div>
        <div className="card-total">
          <h3>
            Cart Total : <span>{totalAmount} FCFA</span>
          </h3>

          <button className="clear-cart" onClick={clearCart}>
            Clear cart
          </button>
        </div>
      </section>
    </>
  );
};

export default ContextCart;
