import React, { useState } from "react";
import FormField from "../FormField";

function FormSimple() {
    const inputsArray = [
        {
          name: "number",
          labelText: "¿Cuántas preguntas tiene el test?",
        },
        {
          name: "correct",
          labelText: "¿Cuántas preguntas has acertado?",
        },
        {
          name: "wrong",
          labelText: "¿Cuántas preguntas has fallado?",
        },
      ];
      const initialTestState = {};
      fillInitialState(inputsArray, initialTestState);
    
      const [testState, setTestState] = useState(initialTestState);
      const [lastTestResult, setLastTestResult] = useState(null);
      const [testCalcError, setTestCalcError] = useState(null);
      const { correct, number, wrong } = testState;
      const handleChange = (e) => {
        e.preventDefault();
        setTestState({ ...testState, [e.target.name]: e.target.value });
      };
      const handleSubmit = (e) => {
        e.preventDefault();
        if (
          !correct ||
          !number ||
          Number(wrong) + Number(correct) > Number(number)
        ) {
          setTestCalcError(
            "Necesitas un número válido de preguntas y al menos el número de respuestas correctas"
          );
          if (lastTestResult) setLastTestResult(null);
          return;
        }
        const testResult = calculateScore({
          numberOfQuestions: number,
          wrong,
          correct,
        });
        setLastTestResult(testResult);
        if (testCalcError) setTestCalcError(null);
      };
    return (
        <form id="Calculator" onSubmit={handleSubmit}>
        {inputsArray.map((input) => (
          <FormField
            name={input.name}
            value={testState[input.name]}
            onChange={handleChange}
            labelText={input.labelText}
          />
        ))}

        <button type="submit">Give it to me!</button>
        {testCalcError && (
          <p className="error" style={{ color: "red" }}>
            testCalcError
          </p>
        )}
        {lastTestResult && (
          <p style={{ color: lastTestResult >= 5 ? "green" : "red" }}>
            lastTestResult
          </p>
        )}
      </form>
    )
}

export default FormSimple;

function fillInitialState(inputsArray, initialTestState) {
    inputsArray.forEach((i) => (initialTestState[i.name] = ""));
  }
  
  function calculateScore({ numberOfQuestions, wrong, correct }) {
    const finalCorrect = correct - wrong / 3;
    const finalTestScore = (finalCorrect / numberOfQuestions) * 10;
    return finalTestScore % 1 !== 0 ? finalTestScore.toFixed(1) : finalTestScore;
  }
