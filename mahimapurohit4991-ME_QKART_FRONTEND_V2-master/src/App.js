import Register from "./components/Register";
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import ipConfig from "./ipConfig.json";
import { Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import Products from "./components/Products";
import theme from "./theme.js"
import { SnackbarProvider } from "notistack";
import Cart from "./components/Cart"
import Checkout from "./components/Checkout";
import Thanks from "./components/Thanks";

export const config = {
  endpoint: `http://${ipConfig.workspaceIp}:8082/api/v1`,
};

function App() {
  return (
    <SnackbarProvider>
    <div className="App">
      <ThemeProvider theme={theme}>
      <Switch>
        <Route path="/register">
          <Register /> 
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route exact path="/">
          <Products/>
        </Route>
        <Route path="/products">
          <Cart/>
        </Route>
        <Route path="/checkout">
          <Checkout/>
        </Route>
        <Route path="/thanks">
          <Thanks/>
        </Route>
      </Switch>
      </ThemeProvider>
      {/* TODO: CRIO_TASK_MODULE_LOGIN - To add configure routes and their mapping */}
               
    </div>
    </SnackbarProvider>
  
  );
}

export default App;
