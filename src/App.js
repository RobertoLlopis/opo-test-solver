import Calculator from "./components/Calculator";
import Header from "./components/Header";

import CalculatorSelectedContextProvider from "./contexts/CalculatorSelectedContext";
import LastTestValuesContextProvider from "./contexts/LastTestsValuesContext";

import "./App.scss";

function App() {
  return (
    <CalculatorSelectedContextProvider>
      <LastTestValuesContextProvider>
        <Header />
        <main>
          <div className="card">
            <h1>Calcula aqui tu nota.</h1>
            <Calculator />
          </div>
        </main>
      </LastTestValuesContextProvider>
    </CalculatorSelectedContextProvider>
  );
}

export default App;
