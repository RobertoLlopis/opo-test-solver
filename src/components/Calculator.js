import FormClasico from "./formsByKindOfTests/FormClasico";
import FormSimple from "./formsByKindOfTests/FormSimple";

function Calculator({calculatorSelected}) {
  const formsByTest = {
    simple: FormSimple,
    clasico: FormClasico,
  }
  const Form = formsByTest[calculatorSelected];

  return  <Form /> ;
}

export default Calculator;

