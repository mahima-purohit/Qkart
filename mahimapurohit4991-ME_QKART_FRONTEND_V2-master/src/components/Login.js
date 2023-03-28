import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import { useHistory } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";

const Login = () => {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [inputState,setInputState] = useState(
    {
      username:"",
      password:"",
    }
  );
  

  // TODO: CRIO_TASK_MODULE_LOGIN - Fetch the API response
  /**
   * Perform the Login API call
   * @param {{ username: string, password: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/login"
   *
   * Example for successful response from backend:
   * HTTP 201
   * {
   *      "success": true,
   *      "token": "testtoken",
   *      "username": "criodo",
   *      "balance": 5000
   * }
   *
   * Example for failed response from backend:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Password is incorrect"
   * }
   *
   */
  const login = async (formData) => {
    // console.log(formData,"formData");
    if(!validateInput(formData)){
      return;
    }
    const loginApiEndpoint = config.endpoint + "/auth/login";
   try{
    const response = await axios.post(loginApiEndpoint, {username:formData.username ,  password:formData.password});
    // if(response.status === 201){
     
      persistLogin(response.data.token, response.data.username, response.data.balance);
      
      setInputState({
          username:"",
          password:"",
      })
      enqueueSnackbar("logged in",{variant:"success"});
    // }
    history.push("/");
   }
   catch(error){
    if(error.response && error.response.status === 400){
      const errorMessage = error.response.data.message;
      enqueueSnackbar(errorMessage,{variant:"warning"});
    }
    else{
      enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON.",{variant:"warning"})
    }
   }
   
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Validate the input
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false and show warning message if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that password field is not an empty value - "Password is a required field"
   */
  const validateInput = (data) => {
    let isInputValid = true;
    // let snackbarMessage = "";
    if(!data.username){
      isInputValid = false;
      enqueueSnackbar("Username is a required field", { variant: "warning" });
  
    }
    if(!data.password){
      isInputValid = false;
      enqueueSnackbar("Password is a required field",{ variant: "warning" });
  
    }
    
    return isInputValid;
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Persist user's login information
  /**
   * Store the login information so that it can be used to identify the user in subsequent API calls
   *
   * @param {string} token
   *    API token used for authentication of requests after logging in
   * @param {string} username
   *    Username of the logged in user
   * @param {string} balance
   *    Wallet balance amount of the logged in user
   *
   * Make use of localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
   * -    `token` field in localStorage can be used to store the Oauth token
   * -    `username` field in localStorage can be used to store the username that the user is logged in as
   * -    `balance` field in localStorage can be used to store the balance amount in the user's wallet
   */
  const persistLogin = (token, username, balance) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("balance", balance);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Login</h2>
        <TextField 
        id="username" 
        label="username" 
        variant="outlined"
        onChange = {(event) => {
          setInputState({...inputState, username:event.target.value})
          // console.log(inputState,"from textfield")
        }}
        />
        
        <TextField 
        id="password" 
        label="password" 
        variant="outlined" 
        onChange = {(event) => {
          setInputState({...inputState, password:event.target.value})
        }}
        />
       
        <Button className="button" variant="contained" onClick= {async()=> {
          
          // if(validateInput(inputState)){
           await login(inputState)
          // }
        }}>
          LOGIN TO QKART
          </Button>
        <h5>Don’t have an account? </h5>
        <Link to="/register">Register now</Link>
        
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;
