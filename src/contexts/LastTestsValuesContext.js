import { useState, createContext, useContext } from "react";

const LastTestValuesContext = createContext({});

const LastTestValuesContextProvider = ({ children }) => {
  const [lastTestsValuesCache, setLastTestsValuesCache] = useState({
    simple: {},
    clasico: {},
    moderno: {},
  });

  return (
    <LastTestValuesContext.Provider
      value={{ lastTestsValuesCache, setLastTestsValuesCache }}
    >
      {children}
    </LastTestValuesContext.Provider>
  );
};

export const useLastTestValuesContext = () => useContext(LastTestValuesContext);

export default LastTestValuesContextProvider;
