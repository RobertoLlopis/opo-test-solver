import FormClasico from "./formsByKindOfTests/FormClasicoModerno";
import FormSimple from "./formsByKindOfTests/FormSimple";

function Calculator({calculatorSelected}) {
  const formsByTest = {
    simple: FormSimple,
    clasico: FormClasico,
    moderno: FormClasico
  }
  const Form = formsByTest[calculatorSelected];

  return  <Form calculatorSelected={calculatorSelected}/> ;
}

export default Calculator;

