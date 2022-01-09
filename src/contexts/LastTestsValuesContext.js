import { useState, createContext, useContext, useEffect } from "react";

const LastTestValuesContext = createContext({});

const LastTestValuesContextProvider = ({ children }) => {
  const [lastTestsValuesCache, setLastTestsValuesCache] = useState({
    simple: {},
    clasico: {},
    moderno: {},
  });
  // When click a button in navbar (simple, clasico, moderno) we set true this state
  // In form component where is setted each kind of testState we hear in a useEffect.
  const [triggerUpdateCache, setTriggerUpdateCache] = useState(false);
  const [kindToGo, setKindToGo] = useState(null);

  const resetTriggerUpdateAndKinToGo = () => {
    setKindToGo(null);
    setTriggerUpdateCache(false);
  };

  return (
    <LastTestValuesContext.Provider
      value={{
        lastTestsValuesCache,
        setLastTestsValuesCache,
        triggerUpdateCache,
        setTriggerUpdateCache,
        kindToGo,
        setKindToGo,
        resetTriggerUpdateAndKinToGo,
      }}
    >
      {children}
    </LastTestValuesContext.Provider>
  );
};

export const useLastTestValuesContext = () => useContext(LastTestValuesContext);

export default LastTestValuesContextProvider;
