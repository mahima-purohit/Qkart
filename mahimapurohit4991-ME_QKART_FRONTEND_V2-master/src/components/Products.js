import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import Cart from "./Cart.js"
import "./Products.css";
import { generateCartItemsFrom } from "./Cart.js";
import { ItemQuantity } from "./Cart.js";
import ProductCard from "./ProductCard";
import { Warning } from "@mui/icons-material";


// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product


/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */


const Products = () => {

  let URL = config.endpoint+"/products"
  let newUrl = URL;
  const token = localStorage.getItem("token");
  const { enqueueSnackbar } = useSnackbar();

  const [debounceTimeout, setDebounceTimeout] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [currentCartItems, setCartItems] = useState([]);
  const [fetchCartData, setFetchCartData] = useState([]);
    const pageRefresh = () => {
    window.location.reload(false);
  }

  useEffect(()=>{
    
    const onLoadHandler = async() => {
      const productsData = await performAPICall();
      // console.log(productsData,"Products Data");
      const cartData = await fetchCart(token);
      // console.log(cartData,"CartData");
      setFetchCartData(cartData);
      const cartDetails = await generateCartItemsFrom(cartData,productsData);
      // console.log(cartDetails,"CartDetails");
      setCartItems(cartDetails);
    }
      onLoadHandler(); 
  },[]);
  
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    setLoading(true);
    try{
      const response = await axios.get(`${config.endpoint}/products`);

      setLoading(false);
      setProducts(response.data);
      setFilteredProducts(response.data);
      return response.data;
    }
    catch(e){
      setLoading(false);

      if(e.response && e.response.status === 500){
        enqueueSnackbar(e.response.data.message, {variant:"error"});
        return null;
      }
      else{
        enqueueSnackbar("couldn't fetch product, Check that the backend is running and reachable",
        {
          variant:"error",
        })
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const updateString =(e)=>{
    setSearchString(e.target.value);
  }
  const performSearch = async (text) => {
    if(text.length>0){
      newUrl = `${URL}/search?value=${text}`;
    }
    try{
      const result = await axios.get(newUrl);
      setLoading(false)
      setProducts(result.data)
      setFilteredProducts(result.data);
      return result.data;
    }
    catch(e){
      setLoading(false);
      if(e.response && e.response.status === 404){
        setFilteredProducts([]);
        return null;
      }
    }
    
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    const value = event.target.value;
    if(debounceTimeout){
      clearTimeout(debounceTimeout);
    }
    const timeout = setTimeout(()=>{
      performSearch(value);
    }, 500);
    setDebounceTimeout(timeout);
  };
  
  const renderCart = () =>{
    // console.log(token);
    if(token)
    {
      return <Cart products={filteredProducts} items={currentCartItems} handleQuantity={async(token,items,products,productId,qty)=>{
        await addToCart(token,items,products,productId,qty)
      }}/>
    }
  }
   /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
    const fetchCart = async (token) => {
      if (!token) return;
  
      try {
        // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
        const fetchedCartItems = await axios.get(`${config.endpoint}/cart`, {
                                    headers: {
                                       Authorization: `Bearer ${token}`
                                    }
                                  });
        return fetchedCartItems.data;
      } catch (e) {
        if (e.response && e.response.status === 400) {
          enqueueSnackbar(e.response.data.message, { variant: "error" });
        } else {
          enqueueSnackbar(
            "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
            {
              variant: "error",
            }
          );
        }
        return null;
      }
    };
  
  
    // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
    /**
     * Return if a product already is present in the cart
     *
     * @param { Array.<{ productId: String, quantity: Number }> } items
     *    Array of objects with productId and quantity of products in cart
     * @param { String } productId
     *    Id of a product to be checked
     *
     * @returns { Boolean }
     *    Whether a product of given "productId" exists in the "items" array
     *
     */
    const isItemInCart = async (items, productId) => {
      let itemInCart = false;
      items.map((item)=>{
        if(item.productId === productId && item.qty > 0){
          itemInCart = true;
        }
        return itemInCart;
      }
      )
      return itemInCart;
    };

    //function for http delete axios call 

    const deleteAxios =  async(productId, qty) => {
      // console.log("delete item called");
      try{
        const deleteResponse = await axios.post(`${config.endpoint}/cart`,
        {
          "productId":productId,
          "qty":qty
        },
        {
          headers: 
          {
            'Authorization': `Bearer ${token}`
          }
        }
        );  
        // setFetchCartData(response.data);
        // const newCartDetails = await generateCartItemsFrom(fetchCartData,filteredProducts);
        // await setCartItems(newCartDetails);
        // console.log(currentCartItems,"newCart");
        console.log(deleteResponse.data,"delete Response");
        return deleteResponse.data;
        //  pageRefresh();
      }
      catch(err){
        enqueueSnackbar(err.response.data);
      }
    }

    //function for post api call

    const postAxios = async(productId,qty) => {
      try{
        const postResponse = await axios.post(`${config.endpoint}/cart`,
        {
          "productId":productId,
          "qty":qty
        },
        {
          headers: 
          {
            'Authorization': `Bearer ${token}`
          }
        }
        );
        // setFetchCartData(response.data);
        // const newCartDetails = await generateCartItemsFrom(fetchCartData,filteredProducts);
        // await setCartItems(newCartDetails);
        // console.log(currentCartItems,"newCart");
        // console.log(postResponse.data,"postResponse");
        return postResponse.data;
        //pageRefresh();

      }
      catch(err){
        enqueueSnackbar(err.response.data);
      }
    }
      
  
    /**
     * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
     *
     * @param {string} token
     *    Authentication token returned on login
     * @param { Array.<{ productId: String, quantity: Number }> } items
     *    Array of objects with productId and quantity of products in cart
     * @param { Array.<Product> } products
     *    Array of objects with complete data on all available products
     * @param {string} productId
     *    ID of the product that is to be added or updated in cart
     * @param {number} qty
     *    How many of the product should be in the cart
     * @param {boolean} options
     *    If this function was triggered from the product card's "Add to Cart" button
     *
     * Example for successful response from backend:
     * HTTP 200 - Updated list of cart items
     * [
     *      {
     *          "productId": "KCRwjF7lN97HnEaY",
     *          "qty": 3
     *      },
     *      {
     *          "productId": "BW0jAAeDJmlZCF8i",
     *          "qty": 1
     *      }
     * ]
     *
     * Example for failed response from backend:
     * HTTP 404 - On invalid productId
     * {
     *      "success": false,
     *      "message": "Product doesn't exist"
     * }
     */
    const addToCart = async (
      token,
      items,
      products,
      productId,
      qty,
      options = { preventDuplicate: false }
    ) => {
      if(!token){
        enqueueSnackbar("Login to add an item to the Cart",{variant:"error"});
      }
     // delete axios request goes here
      if(qty === 0){
        const newCartdeleteResponse = await deleteAxios(productId, qty);
        const filteredCartResponse = newCartdeleteResponse.filter((item) => item.qty > 0);
        setFetchCartData(filteredCartResponse);
        const cartDetails = await generateCartItemsFrom(filteredCartResponse, products);
        // console.log(cartDetails,"CartDetails");
        setCartItems(cartDetails);
        return;
        // pageRefresh();
      }
       if(await isItemInCart(items,productId)){
        if(options.preventDuplicate){
          enqueueSnackbar("item already in cart",{variant:"warning"});
           return;
        }
      }
      if(qty>0){
        const newCartpostResponse = await postAxios(productId,qty);
        // pageRefresh();
        setFetchCartData(newCartpostResponse);
        const cartDetails = await generateCartItemsFrom(newCartpostResponse, products);
        // console.log(cartDetails,"CartDetails");
        setCartItems(cartDetails);
      }
      
    };
  return (
    <div>
      <Header>
          <TextField
          className="search-desktop"
          size="large"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          onChange={(e)=>{
            debounceSearch(e, debounceTimeout);
            updateString(e);
          }}
        />
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        value={searchString}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(e)=>{
          debounceSearch(e, debounceTimeout);
          updateString(e);
        }}
      />
       <Grid container>
         <Grid 
            item
            xs={12}
            md={token && products.length ? 9 :12}
            className="product-grid">
           <Box className="hero">
             <p className="hero-heading">
               India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
               to your door step
             </p>
           </Box>
           {isLoading ? (
            <Box  className="loading">
              <CircularProgress/>
              <p>Loading Products...</p>
            </Box>
           ):
           (
            <Grid container marginY="1rem" paddingX="1rem" spacing={2}>
              {filteredProducts.length ? (
                filteredProducts.map((products) => {
               return(  
                <Grid item xs={6} md={3} key={products._id}>
                <ProductCard
                product={products}
                handleAddToCart={async()=>{
                  let quantity = 1;
                  await addToCart(token,fetchCartData,filteredProducts,products._id,quantity,{ preventDuplicate: true });
                }}
                />
                </Grid>
               )
                })
              ):
              (
                <Box  className="loading">
                  <SentimentDissatisfied color="action"/>
                  <h4 style={{color:"#636363"}}>No Products Found</h4>
                </Box>
              )
              }
            </Grid>
           )}
         </Grid>
         <Grid item xs={12} md={3}>
         {renderCart()}
         </Grid>
         
       </Grid>
       
      <Footer />
    </div>
  );
};

export default Products;
