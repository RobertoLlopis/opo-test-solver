import { useState } from "react";
import "./App.scss";
import Calculator from "./components/Calculator";
import Header from "./components/Header";
import LastTestValuesContextProvider from "./contexts/LastTestsValuesContext";

function App() {
  const [calculatorSelected, setCalculatorSelected] = useState("simple");

  return (
    <LastTestValuesContextProvider>
      <Header
        calculatorSelected={calculatorSelected}
        setCalculatorSelected={setCalculatorSelected}
      />
      <main>
        <div className="card">
          <h1>Calcula aqui tu nota.</h1>
          <Calculator calculatorSelected={calculatorSelected} />
        </div>
      </main>
    </LastTestValuesContextProvider>
  );
}

export default App;
