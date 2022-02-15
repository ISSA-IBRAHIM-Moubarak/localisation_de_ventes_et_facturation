/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// any CSS you import will output into a single css file (app.css in this case)
import React, { useState } from "react";
import ReactDOM from "react-dom";
import {
  HashRouter,
  Route,
  Switch,
  withRouter,
} from "react-router-dom/cjs/react-router-dom.min";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// start the Stimulus application
import "./bootstrap";
import IPrint from "./styles/components/IPrint";
import "./styles/app.css";
import Navbar from "./styles/components/Navbar";
import PrivateRoute from "./styles/components/PrivateRoute";
import AuthContext from "./styles/contexts/AuthContext";
import ArticleFormAddEdit from "./styles/pages/ArticleFormAddEdit";
import ArticlePage from "./styles/pages/ArticlePage";
import Impression from "./styles/pages/Impression";
import CustomerFormAddEdit from "./styles/pages/CustomerFormAddEdit";
import CustomerPage from "./styles/pages/CustomerPage";
import ExporterFacture from "./styles/pages/ExporterFacture";
import HomePage from "./styles/pages/HomePage";
import InvoiceFormAddEdit, {
  CartContext,
} from "./styles/pages/InvoiceFormAddEdit";
import InvoicesPage from "./styles/pages/InvoicesPage";
import LoginPage from "./styles/pages/LoginPage";
import RegisterPage from "./styles/pages/RegisterPage";
import AuthAPI from "./styles/services/authAPI";

AuthAPI.setup();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    AuthAPI.isAuthenticated()
  );

  const NavbarWithRouter = withRouter(Navbar);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      <HashRouter>
        <NavbarWithRouter />
        <main className="className container pt-5">
          <Switch>
            <Route path="/login" component={LoginPage} />
            <Route path="/register" component={RegisterPage} />
            <PrivateRoute path="/impression" component={Impression} />
            <PrivateRoute path="/exportation" component={ExporterFacture} />
            <PrivateRoute path="/articles/:id" component={ArticleFormAddEdit} />
            <PrivateRoute path="/articles" component={ArticlePage} />
            <PrivateRoute path="/invoices/:id" component={InvoiceFormAddEdit} />
            <PrivateRoute path="/invoices" component={InvoicesPage} />
            <PrivateRoute
              path="/customers/:id"
              component={CustomerFormAddEdit}
            />
            <PrivateRoute path="/customers" component={CustomerPage} />
            <Route path="/" component={HomePage} />
          </Switch>
        </main>
      </HashRouter>
      <ToastContainer position={toast.POSITION.BOTTOM_LEFT} />
    </AuthContext.Provider>
  );
};
const rootElement = document.querySelector("#app");
ReactDOM.render(<App />, rootElement);

//javascript
//console.log("Hello world")
