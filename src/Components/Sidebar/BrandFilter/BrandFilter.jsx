import axios from "axios";
import { useState, useEffect } from "react";
import { useReducerContext } from "../../../context/useReducer.context";
import { Loader } from "../../Loader/Loader";

export const BrandFilter = () => {
  const { loading } = useReducerContext();

  const [brandData, setBrandData] = useState([]);

  useEffect(() => {
      (async function () {
        const { data } = await axios.get("/api/brands");
        setBrandData(data.brands);
      })();
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <li className="filter-section-title">Brands</li>
          {brandData.map((brands) => {
            return (
              <li key={brands.id}>
                <label className="form-label">
                  <input type="checkbox" />
                  {brands.brandName}
                </label>
              </li>
            );
          })}
        </>
      )}
    </>
  );
};
