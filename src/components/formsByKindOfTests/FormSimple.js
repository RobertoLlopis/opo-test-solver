import React, { useEffect, useState } from "react";
import { useLastTestValuesContext } from "../../contexts/LastTestsValuesContext";
import useUpdateCache from "../../hooks/useUpdateCache";
import {
  calculateScore,
  fillInitialState,
  isEmpty,
  readLocalStorageJSON,
} from "../../utils";
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
  const initialTestState = fillInitialState(inputsArray);

  const { lastTestsValuesCache, triggerUpdateCache } =
    useLastTestValuesContext();

  const cachedTestState =
    typeof lastTestsValuesCache.simple === "object"
      ? lastTestsValuesCache.simple
      : {};
  const cachedLocalStorage =
    typeof readLocalStorageJSON("lastTestValuesCache")?.simple === "object"
      ? readLocalStorageJSON("lastTestValuesCache").simple
      : {};
  const cached = !isEmpty(cachedTestState)
    ? cachedTestState
    : (!isEmpty(cachedLocalStorage) && cachedLocalStorage) || null;

  const [testState, setTestState] = useState(cached || initialTestState);
  const [lastTestResult, setLastTestResult] = useState(null);
  const [testCalcError, setTestCalcError] = useState(null);
  const { handleCacheUpdate } = useUpdateCache();
  const { correct, number, wrong } = testState;

  const handleChange = (e) =>
    setTestState({ ...testState, [e.target.name]: e.target.value });

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

  useEffect(() => {
    if (triggerUpdateCache) {
      console.log(`testState`, testState);
      const newLastTestsValuesCache = {
        ...lastTestsValuesCache,
        simple: { ...testState },
      };
      handleCacheUpdate(newLastTestsValuesCache);
    }
  }, [triggerUpdateCache]);

  return (
    <form id="Calculator" onSubmit={handleSubmit}>
      {inputsArray.map((input) => (
        <FormField
          name={input.name}
          value={testState[input.name]}
          onChange={handleChange}
          labelText={input.labelText}
          key={input.name}
        />
      ))}

      <button type="submit">Give it to me!</button>
      {!!testCalcError && (
        <p className="error" style={{ color: "red" }}>
          {testCalcError}
        </p>
      )}
      {!!lastTestResult && (
        <p style={{ color: lastTestResult >= 5 ? "green" : "red" }}>
          {lastTestResult}
        </p>
      )}
    </form>
  );
}

export default FormSimple;
