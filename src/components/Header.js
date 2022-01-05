import React from "react";

function Header({ calculatorSelected, setCalculatorSelected }) {
  function handleHeaderButtonClick(e) {
    const { id } = e.target;
    setCalculatorSelected(id);
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
