import "./App.scss";
import Calculator from "./components/Calculator";

function App() {
  return (
    <main>
      <div className="card">
        <h1>Calcula aqui tu nota.</h1>
        <Calculator />
      </div>
    </main>
  );
}

export default App;
