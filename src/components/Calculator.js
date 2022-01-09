import { useCalculatorSelectedContext } from "../contexts/CalculatorSelectedContext";
import FormClasico from "./formsByKindOfTests/FormClasicoModerno";
import FormSimple from "./formsByKindOfTests/FormSimple";

function Calculator() {
  const { calculatorSelected } = useCalculatorSelectedContext();
  const formsByTest = {
    simple: FormSimple,
    clasico: FormClasico,
    moderno: FormClasico
  }
  console.log(`calculatorSelected`, calculatorSelected)
  const Form = formsByTest[calculatorSelected];

  return  <Form calculatorSelected={calculatorSelected}/> ;
}

export default Calculator;

