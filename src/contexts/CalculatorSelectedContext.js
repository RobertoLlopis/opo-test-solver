import { useState, createContext, useContext } from "react";

const CalculatorSelectedContext = createContext({});

const CalculatorSelectedContextProvider = ({ children }) => {
    const [calculatorSelected, setCalculatorSelected] = useState("simple");

  return (
    <CalculatorSelectedContext.Provider
      value={{ calculatorSelected, setCalculatorSelected }}
    >
      {children}
    </CalculatorSelectedContext.Provider>
  );
};

export const useCalculatorSelectedContext = () => useContext(CalculatorSelectedContext);

export default CalculatorSelectedContextProvider;
