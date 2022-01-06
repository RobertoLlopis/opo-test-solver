import { useState, createContext, useContext } from "react";

const LastResutsContext = createContext({});

const LastResutsContextProvider = ({ children }) => {
  const [lastResultsCache, setLastResultsCache] = useState({
    simple: {},
    clasico: {},
    moderno: {},
  });

  return (
    <LastResutsContext.Provider
      value={{ lastResultsCache, setLastResultsCache }}
    >
      {children}
    </LastResutsContext.Provider>
  );
};

export const useLastResutsContext = () => useContext(LastResutsContext);

export default LastResutsContextProvider;
