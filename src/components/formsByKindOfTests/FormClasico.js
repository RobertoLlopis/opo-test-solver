import React, { useEffect, useState } from "react";
import FormField from "../FormField";

const clasicoInfo = {
  breakScoreDefaultPart1: 21,
  breakScoreDefaultPart2: 6,
  questionsPart1: 60,
  questionsPart2: 20,
};

function FormClasico() {
  const inputsArray = [
    {
      name: "breakScorePart1",
      labelText:
        "¿Cuál es la nota de corte que quieres aplicar en la primera parte?",
    },
    {
      name: "correctPart1",
      labelText: "¿Cuántas preguntas has acertado en la primera parte?",
    },
    {
      name: "wrongPart1",
      labelText: "¿Cuántas preguntas has fallado en la primera parte?",
    },
    {
      name: "breakScorePart2",
      labelText:
        "¿Cuál es la nota de corte que quieres aplicar en la segunda parte?",
    },
    {
      name: "correctPart2",
      labelText: "¿Cuántas preguntas has acertado en la segunda parte?",
    },
    {
      name: "wrongPart2",
      labelText: "¿Cuántas preguntas has fallado en la segunda parte?",
    },
  ];

  const initialResultErrorState = { 1: null, 2: null };
  const initialTestState = fillInitialState(inputsArray);

  const [testState, setTestState] = useState(initialTestState);
  const [lastTestResult, setLastTestResult] = useState(initialResultErrorState);
  const [testCalcError, setTestCalcError] = useState(initialResultErrorState);
  const [transformedScores, setTransformedScores] = useState({
    ...initialResultErrorState,
    overall: null,
  });
  const [tansformedScoreError, setTansformedScoreError] = useState(null);
  const {
    correctPart1,
    correctPart2,
    wrongPart1,
    wrongPart2,
    breakScorePart1,
    breakScorePart2,
  } = testState;
  const {
    breakScoreDefaultPart1,
    breakScoreDefaultPart2,
    questionsPart1,
    questionsPart2,
  } = clasicoInfo;

  const calculateNormalScore = (part) => {
    const correct = part === 1 ? correctPart1 : correctPart2;
    const wrong = part === 1 ? wrongPart1 : wrongPart2;
    const numberOfQuestions = part === 1 ? questionsPart1 : questionsPart2;
    return calculateScore({
      numberOfQuestions,
      wrong,
      correct,
    });
  };

  const calculateTransformedScores = () => {
    const rawScorePart1 = calculateRawScore(correctPart1, wrongPart1);
    const rawScorePart2 = calculateRawScore(correctPart2, wrongPart2);

    if (
      rawScorePart1 < breakScoreDefaultPart1 ||
      rawScorePart2 < breakScoreDefaultPart2
    ) {
      if (
        rawScorePart1 < breakScoreDefaultPart1 &&
        rawScorePart2 < breakScoreDefaultPart2
      ) {
        setTansformedScoreError(
          `Las dos partes del exámen están por debajo del número de nota de corte mínimo del 30%.`
        );
        return;
      }
      if (rawScorePart1 < breakScoreDefaultPart1) {
        setTansformedScoreError(
          `La primera parte del exámen está por debajo del número de nota de corte mínimo del 30%.`
        );
        return;
      }
      setTansformedScoreError(
        "La segunda parte del exámen está por debajo del número de nota de corte mínimo del 30%."
      );
      return;
    }

    const transformedScoreFirstPart = formulaComputed(
      rawScorePart1,
      breakScorePart1,
      questionsPart1,
      "clasico"
    );
    const transformedScoreSecondPart = formulaComputed(
      rawScorePart2,
      breakScorePart2,
      questionsPart2,
      "clasico"
    );

    return {
      1: transformedScoreFirstPart,
      2: transformedScoreSecondPart,
      overall: returnValueFixed(
        transformedScoreFirstPart + transformedScoreSecondPart
      ),
    };
  };

  const handleChange = (e) => {
    e.preventDefault();
    setTestState({
      ...testState,
      [e.target.name]: Number.isNaN(e.target.value)
        ? ""
        : Number(e.target.value),
    });
  };

  const isNotValidAnswers = ({ part }) =>
    !(part === 1 ? correctPart1 : correctPart2) ||
    Number(
      (part === 1 ? wrongPart1 : wrongPart2) +
        Number(part === 1 ? correctPart1 : correctPart2) >
        Number(part === 1 ? questionsPart1 : questionsPart2)
    );
  const handleSubmit = (e) => {
    e.preventDefault();
    setTestCalcError({
      1: isNotValidAnswers({ part: 1 })
        ? "Necesitas un número válido de preguntas y al menos el número de respuestas correctas en la parte 1 del exámen."
        : null,
      2: isNotValidAnswers({ part: 2 })
        ? "Necesitas un número válido de preguntas y al menos el número de respuestas correctas en la parte 2 del exámen."
        : null,
    });
    setLastTestResult({
      1: calculateNormalScore(1),
      2: calculateNormalScore(2),
    });
  };

  useEffect(() => {
    const canCalculateTransformedScore =
      !!lastTestResult[1] && !!lastTestResult[2];

    if (canCalculateTransformedScore) {
      const transformedScores = calculateTransformedScores();
      const areValidScores = Object.values(transformedScores).every(
        (score) => !!score
      );
      if (areValidScores) {
        setTransformedScores(transformedScores);
      }
    }
  }, [lastTestResult]);
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
      {testCalcError[1] && (
        <p className="error" style={{ color: "red" }}>
          {testCalcError[1]}
        </p>
      )}
      {!!lastTestResult[1] && (
        <p style={{ color: lastTestResult[1] >= 5 ? "green" : "red" }}>
          Nota primera parte: {lastTestResult[1]}
        </p>
      )}
      {testCalcError[2] && (
        <p className="error" style={{ color: "red" }}>
          {testCalcError[2]}
        </p>
      )}
      {!!lastTestResult[2] && (
        <p style={{ color: lastTestResult[2] >= 5 ? "green" : "red" }}>
          Nota segunda parte: {lastTestResult[2]}
        </p>
      )}
      {transformedScores[1] && (
        <p
          style={{
            color: transformedScores[1] >= 25 ? "green" : "red",
          }}
        >
          Nota transformada de la primera parte: {transformedScores[1]}
        </p>
      )}
      {transformedScores[2] && (
        <p
          style={{
            color: transformedScores[2] >= 25 ? "green" : "red",
          }}
        >
          Nota transformada de la segunda parte: {transformedScores[2]}
        </p>
      )}
      {transformedScores.overall && (
        <p
          style={{
            color: transformedScores.overall >= 25 ? "green" : "red",
          }}
        >
          Nota transformada: {transformedScores.overall}
        </p>
      )}
      {tansformedScoreError && (
        <p className="error" style={{ color: "red" }}>
          {tansformedScoreError}
        </p>
      )}
    </form>
  );
}

export default FormClasico;

function fillInitialState(inputsArray) {
  return inputsArray.reduce((acc, inputInfo) => {
    acc[inputInfo.name] = "";
    return acc;
  }, {});
}

function calculateRawScore(correct, wrong) {
  return correct - wrong / 3;
}

function calculateScore({ numberOfQuestions, wrong, correct }) {
  const finalCorrect = correct - wrong / 3;
  const finalTestScore = (finalCorrect / numberOfQuestions) * 10;
  return returnValueFixed(finalTestScore);
}

function returnValueFixed(value) {
  return value % 1 !== 0 ? value.toFixed(1) : value;
}

function formulaComputed(rawScore, breakScore, numberOfQuestions, kind) {
  const weigth = kind === "clasico" ? 25 : 50;

  return (
    weigth * ((rawScore - breakScore) / (numberOfQuestions - breakScore)) +
    weigth
  );
}
