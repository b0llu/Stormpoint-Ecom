import axios from "axios";
import { useState, useEffect } from "react";
import { useFilterReducerContext } from "../../../context/FilterReducer.context";

export const BrandFilter = () => {
  const { brands, dispatch } = useFilterReducerContext();

  const [brandData, setBrandData] = useState([]);

  // initializing brands from data
  useEffect(() => {
    (async function () {
      const { data } = await axios.get("/api/brands");
      setBrandData(data.brands);
    })();
  }, []);

  return (
    <>
      <li className="filter-section-title">Brands</li>
      {brandData.map((brand) => {
        return (
          <li key={brand.id}>
            <label className="form-label">
              <input
                className="checkbox-input"
                checked={brands[brand.value] ?? false}
                value={brand.value}
                onChange={(e) =>
                  dispatch({
                    type: "BRAND_FILTER",
                    payload: e.target.value,
                  })
                }
                type="checkbox"
              />
              {brand.brandName}
            </label>
          </li>
        );
      })}
    </>
  );
};
