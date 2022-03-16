import axios from "axios";
import { useEffect } from "react";
import { Loader } from "../../../../Components";
import { useFilterReducerContext } from "../../../../context/FilterReducer.context";
import { useFilterFunctionCombiner } from "../../../../Hook/useFilterFunctionCombiner";
import "./CardContainer.css";

export const CardContainer = () => {
  const { sortedProducts } = useFilterFunctionCombiner();
  const { loading, dispatch } = useFilterReducerContext();

  // initializing products from data
  useEffect(() => {
    dispatch({ type: "LOADING" }),
      (async function () {
        const { data } = await axios.get("./api/products");
        dispatch({ type: "INITIALIZE_PRODUCTS", payload: data.products });
        dispatch({ type: "LOADING" });
      })();
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          {sortedProducts.map((products) => {
            return (
              <div
                key={products.id}
                className="card-container product-card card-shadow"
              >
                <div className="product-img">
                  <img
                    className="card-img"
                    src={products.image}
                    alt={products.alt}
                  />
                </div>
                {products.badge && (
                  <h6 className="card-badge">{products.badge}</h6>
                )}
                {/* {wishlist.some((item) => item.id === products.id) ? (
                <h1
                  onClick={() =>
                    dispatch({ type: "REMOVE_FROM_WISHLIST", payload: products })
                  }
                  className="card-subtitle"
                >
                  {products.title} <i className="fas fa-heart fav-added"></i>
                </h1>
              ) : ( */}
                <h1
                  onClick={() =>
                    dispatch({ type: "ADD_TO_WISHLIST", payload: products })
                  }
                  className="card-subtitle"
                >
                  {products.title} <i className="fas fa-heart"></i>
                </h1>
                {/* )} */}

                <h2 className="card-title">Brand : {products.subTitle}</h2>
                <p className="card-description">{products.description}</p>
                <p className="card-description">Price: ₹{products.price}</p>
                <div className="card-btn">
                  {/* {cart.some((item) => item.id === products.id) ? (
                  <Link to="/Cart" element={<CartPage />}>
                  <button className="btn">Go To Cart</button>
                ) : ( */}
                  {/* </Link> */}
                  <button
                    onClick={() =>
                      dispatch({ type: "ADD_TO_CART", payload: products })
                    }
                    className="btn"
                  >
                    Add to Cart
                  </button>
                  {/* )} */}
                </div>
                <div
                  className={` ${products.inStock ? "hidden" : "out-of-stock"}`}
                >
                  <span>Out Of Stock</span>
                </div>
              </div>
            );
          })}
        </>
      )}
    </>
  );
};
