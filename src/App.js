import { useState } from "react";
import "./App.scss";
import Calculator from "./components/Calculator";
import Header from "./components/Header";

function App() {
  const [calculatorSelected, setCalculatorSelected] = useState("simple");

  return (
    <>
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
    </>
  );
}

export default App;
