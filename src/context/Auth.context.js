import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";
import { useCartContext } from "./Cart.context";
import { useFilterReducerContext } from "./FilterReducer.context";
import { useWishlistContext } from "./Wishlist.context";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const { setWishlistProducts } = useWishlistContext();
  const { setCartProducts } = useCartContext();
  const { dispatch } = useFilterReducerContext();
  const encodedToken = localStorage.getItem("StormPointToken");
  const [userState, setUserState] = useState([]);

  const login = async (userDetails) => {
    try {
      const { data } = await axios.post(`/api/auth/login`, {
        email: userDetails.email,
        password: userDetails.password,
      });

      const cartResponse = await axios.get("/api/user/cart", {
        headers: {
          authorization: data.encodedToken,
        },
      });
      if (cartResponse.status === 200) {
        setCartProducts(cartResponse.data.cart);
      }

      const wishlistResponse = await axios.get("/api/user/wishlist", {
        headers: {
          authorization: data.encodedToken,
        },
      });
      if (wishlistResponse.status === 200) {
        setWishlistProducts(wishlistResponse.data.wishlist);
      }
      // saving the encodedToken in the localStorage
      localStorage.setItem("StormPointToken", data.encodedToken);
      localStorage.setItem("StormPointUser", data.foundUser.firstName);
      dispatch({ type: "SUCCESS_TOAST", payload: "Log In Successful" });
    } catch (error) {
      dispatch({ type: "ERROR_TOAST", payload: error.response.data.errors });
    }
  };

  const signup = async (userDetails) => {
    try {
      const { data } = await axios.post(`/api/auth/signup`, {
        firstName: userDetails.user,
        email: userDetails.email,
        password: userDetails.passwordOne,
      });
      // saving the encodedToken in the localStorage
      localStorage.setItem("StormPointToken", data.encodedToken);
      localStorage.setItem("StormPointUser", data.createdUser.firstName);
      dispatch({ type: "SUCCESS_TOAST", payload: "Sign Up Successful" });
    } catch (error) {
      dispatch({ type: "ERROR_TOAST", payload: error.response.data.errors });
    }
  };

  const signout = () => {
    dispatch({ type: "ERROR_TOAST", payload: "Logged Out" });
    localStorage.removeItem('StormPointToken');
    localStorage.removeItem('StormPointUser');
    setCartProducts([]);
    setWishlistProducts([]);
    setUserState([]);
  };

  const testLogger = async () => {
    try {
      const { data } = await axios.post("/api/auth/login", {
        email: "admin@gmail.com",
        password: "admin",
      });

      const cartResponse = await axios.get("/api/user/cart", {
        headers: {
          authorization: data.encodedToken,
        },
      });
      if (cartResponse.status === 200) {
        setCartProducts(cartResponse.data.cart);
      }

      const wishlistResponse = await axios.get("/api/user/wishlist", {
        headers: {
          authorization: data.encodedToken,
        },
      });
      if (wishlistResponse.status === 200) {
        setWishlistProducts(wishlistResponse.data.wishlist);
      }

      localStorage.setItem("StormPointToken", data.encodedToken);
      localStorage.setItem("StormPointUser", data.foundUser.firstName);
      dispatch({ type: "SUCCESS_TOAST", payload: "Log In Successful" });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async function () {
      if (encodedToken) {
        try {
          const response = await axios.post("/api/auth/verify", {
            encodedToken: encodedToken,
          });
          if (response && response.data) {
            setUserState(response.data.user);
            setCartProducts(response.data.user.cart);
            setWishlistProducts(response.data.user.wishlist);
          }
        } catch (error) {
          console.log(error);
        }
      }
    })();
  }, [encodedToken]);

  return (
    <AuthContext.Provider
      value={{ login, signup, signout, testLogger, userState }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuthContext = () => useContext(AuthContext);

export { useAuthContext, AuthProvider };
