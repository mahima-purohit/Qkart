import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { useEffect,useState } from "react";
import React from "react";
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const headerSearch = children;
  // console.log(headerSearch);
  //=======================
  const [isDesktop, setDesktop] = useState(window.innerWidth > 1450);
  const updateMedia = () => {
    setDesktop(window.innerWidth > 740);
  };
  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  });
  //========================
  const history = useHistory();
  let isLoggedin = localStorage.getItem('username') === null ? false : true;
  const logOutHandler = () => {
    localStorage.clear();
    window.location.reload()
    history.push("/");
  }
    return (
      <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
        {(isDesktop &&  <div>{headerSearch}</div>)}
        {hasHiddenAuthButtons ? 
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick = {()=>history.push("/")}
        >
          {/* <Link to="/"> */}
              Back to explore
          {/* </Link> */}
          
        </Button> 
      :
      isLoggedin ? 
      <Stack 
    spacing={2} direction="row" justifyContent="center" alignItems="center">
    <Avatar alt={localStorage.getItem('username')} src="public/avatar.png"/>
    <p>{`${localStorage.getItem('username')}`}</p>
    <Button variant="text" onClick={(e)=>logOutHandler(e,history)}>LOGOUT</Button>

    </Stack> 
      :
    <Stack 
    spacing={2} direction="row" justifyContent="center" alignItems="center">
    <Button variant="text"  onClick={()=>history.push("/login")}>
      LOGIN
      </Button>
    <Button variant="text" onClick={()=>history.push("/register")}>
      REGISTER
     </Button>
    </Stack>
      } 
      </Box>
    );
};

export default Header;
