import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";
import Cart from "./Cart"


const ProductCard = ({ product, handleAddToCart }) => {

  return (
    <Card className="card" id={product._id}>
      <CardMedia
        component="img"
        alt={product.name}
        // sx={{ height: 200 }}
        image={product.image}
      />
      <CardContent>
        <Typography>
          {product.name}
        </Typography>
        <Typography paddingY="0.5rem" fontWeight="700">
          ${product.cost}
        </Typography>
        
        <Rating
        role="img"
        aria-label="stars"
        name="simple-controlled"
        defaultValue={2}
        value={product.rating}
        // precision={0.5}
      />
      </CardContent>
      <CardActions
        className="card-actions">
     
        <Button 
        className="card-button"
        variant="contained" 
        fullWidth 
        startIcon={<AddShoppingCartOutlined/>}
        onClick={handleAddToCart}>
          ADD TO CART
        </Button>
        
      </CardActions>
    </Card>
  );
};

export default ProductCard;
