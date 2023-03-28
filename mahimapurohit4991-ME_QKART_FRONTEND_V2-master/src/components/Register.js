import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import Alert from '@mui/material/Alert';
import { Route, Switch } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";

const Register = () => {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [inputState, setInputState] = useState({
    username: "",
    password: "",
    confirmPassword: ""
  });

  const [bannerValue, setBannerValue] = useState(null)



  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  const register = async (formData) => {
    const postData = formData;
    const registerApiEndPoint = config.endpoint + "/auth/register";
    try{
    const response = await axios.post(registerApiEndPoint, {username: formData.username, password: formData.password});
    
    if(response.status ===201){
      setBannerValue({
        value:"201",
        alertMessage:"Registered successfully",
        severity: "success"
      })
      // alert("Registered Successfully");
    }
    history.push("/login");
     
    }
    catch(error) {
      if(error && error.response && error.response.status && error.response.status === 400){
       const message = error.response.data.message
        setBannerValue({
          value:"400",
          alertMessage:message,
          severity: "warning"
        })
        // alert(error.response.data.message);
      }
      else{
        setBannerValue({
          value:"backend",
          alertMessage:"Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
          severity: 'error'
        })
        alert("Something went wrong. Check that the backend is running, reachable and returns valid JSON.")
      }
     
    }
    };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const [validateInputState,setValidateInputstate] = useState({
    caseValue:"null",
    inputValidationAlertMessage:"null"
  })
  const validateInput = (data) => {
    let isValid = true;
    setBannerValue(null);
    // console.log("I am data",data);
    if(!data.username || data.username.length == 0){
      isValid=false;
      setValidateInputstate({
        caseValue:"emptyUsername",
        inputValidationAlertMessage:"Username is a required field"
      })
      setBannerValue({
        value:"emptyUsername",
        alertMessage:"Username is a required field",
        severity: "error"
      })
    }
    if(data.username && data.username.length < 6){
      isValid=false;
      setValidateInputstate({
        caseValue:"short user name",
        inputValidationAlertMessage:"Username must be at least 6 characters"
      })
      setBannerValue({
        value:"short user name",
        alertMessage:"Username must be at least 6 characters",
        severity: "error"
      })
    }
    if(!data.password || data.password.length == 0){
      isValid=false;
      setValidateInputstate({
        caseValue:"null password",
        inputValidationAlertMessage:"Password is a required field"
      })
      setBannerValue({
        value:"null password",
        alertMessage:"Password is a required field",
        severity: "error"
      })
    }
    if(data.password && data.password.length < 6){
      isValid=false;
      setValidateInputstate({
        caseValue:"short password",
        inputValidationAlertMessage:"Password must be at least 6 characters"
      })
      setBannerValue({
        value:"short password",
        alertMessage:"Password must be at least 6 characters",
        severity: "error"
      })
    }
    if(isValid &&  data.password != data.confirmPassword){
      isValid=false;
      setValidateInputstate({
        caseValue:"password mismatch",
        inputValidationAlertMessage:"Passwords do not match"
      })
      setBannerValue({
        value:"password mismatch",
        alertMessage:"Passwords do not match",
        severity: "error"
      })
    }
    
    return isValid;
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
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            value={inputState.username}
            onChange={(event) => {setInputState({...inputState, username: event.target.value})}}
            placeholder="Enter Username"
            fullWidth
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            value={inputState.password}
            onChange={(event) => { setInputState({...inputState,password:event.target.value})}}
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            value={inputState.confirmPassword}
            onChange={(event)=>{ setInputState({...inputState,confirmPassword:event.target.value})}}
            type="password"
            fullWidth
          />
           <Button className="button" variant="contained" onClick = {() => {
            if(validateInput(inputState)){
              register(inputState)
            }
            }}>
            Register Now
           </Button>
          <p className="secondary-action">
            Already have an account?{" "}
            <Link to="/login" >
            Login here
            </Link>
            
            
             {/* <a className="link" href="#"> */}
             
          </p>
        </Stack>
      </Box>
          {bannerValue && <Alert variant="filled" severity={bannerValue.severity}>{bannerValue.alertMessage}</Alert>}
          
      <Footer />
    </Box>
    
  );

};

export default Register;
