import { useCalculatorSelectedContext } from "../contexts/CalculatorSelectedContext";
import { useLastTestValuesContext } from "../contexts/LastTestsValuesContext";

function Header() {
  const { calculatorSelected } = useCalculatorSelectedContext();
  const { setTriggerUpdateCache, setKindToGo } = useLastTestValuesContext();

  function handleHeaderButtonClick(e) {
    const { id } = e.target;
    setTriggerUpdateCache(true);
    setKindToGo(id);
  }

  return (
    <header className="Header">
      <nav>
        <ul>
          <li>
            <button
              id="simple"
              className={calculatorSelected === "simple" ? "selected" : ""}
              onClick={handleHeaderButtonClick}
            >
              Calculadora Simple
            </button>
          </li>
          <li>
            <button
              id="clasico"
              className={calculatorSelected === "clasico" ? "selected" : ""}
              onClick={handleHeaderButtonClick}
            >
              Calcula Exámen clásico
            </button>
          </li>
          <li>
            <button
              id="moderno"
              className={calculatorSelected === "moderno" ? "selected" : ""}
              onClick={handleHeaderButtonClick}
            >
              Calcula Exámen moderno
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
