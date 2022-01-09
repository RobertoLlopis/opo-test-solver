import React, { useEffect, useState } from "react";
import FormField from "../FormField";
import { useLastTestValuesContext } from "../../contexts/LastTestsValuesContext";
import { useUpdateEffect } from "../../hooks/useUpdateEffect";
import useUpdateCache from "../../hooks/useUpdateCache";
import {
  calculateScore,
  fillInitialState,
  isEmpty,
  readLocalStorageJSON,
  returnValueFixed,
  writeLocalStorageJSON,
} from "../../utils";

const clasicoInfo = {
  breakScoreDefaultPart1: 18,
  breakScoreDefaultPart2: 6,
  questionsPart1: 60,
  questionsPart2: 20,
};

const modernoInfo = {
  breakScoreDefaultPart1: 21,
  breakScoreDefaultPart2: 6,
  questionsPart1: 70,
  questionsPart2: 20,
};

const inputsArrayPart1 = [
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
];
const inputsArrayPart2 = [
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
function FormClasicoModerno({ calculatorSelected: kind }) {
  const isClasico = kind === "clasico";
  const initialResultErrorState = { 1: null, 2: null };
  const initialTestState = fillInitialState([
    ...inputsArrayPart1,
    ...inputsArrayPart2,
  ]);

  const { lastTestsValuesCache, triggerUpdateCache } =
    useLastTestValuesContext();

  const cachedTestState =
    lastTestsValuesCache[isClasico ? "clasico" : "moderno"];
  const cachedLocalStorage = readLocalStorageJSON("lastTestsValuesCache")?.[
    isClasico ? "clasico" : "moderno"
  ];
  const cached = !isEmpty(cachedTestState)
    ? cachedTestState
    : !isEmpty(cachedLocalStorage)
    ? cachedLocalStorage
    : false;
  console.log(`cached, kind`, cached);
  const [testState, setTestState] = useState(cached || initialTestState);
  const [lastTestResult, setLastTestResult] = useState(initialResultErrorState);
  const [testCalcError, setTestCalcError] = useState(initialResultErrorState);
  const [transformedScores, setTransformedScores] = useState({
    ...initialResultErrorState,
    overall: null,
  });
  const [transformedScoreError, setTransformedScoreError] = useState(null);
  const { handleCacheUpdate } = useUpdateCache();

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
  } = isClasico ? clasicoInfo : modernoInfo;

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
    const errorReturnObject = {
      ...initialResultErrorState,
      overall: null,
    };
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
        setTransformedScoreError(
          `Las dos partes del exámen están por debajo del número de nota de corte mínimo del 30%.`
        );
        return errorReturnObject;
      }
      if (rawScorePart1 < breakScoreDefaultPart1) {
        setTransformedScoreError(
          `La primera parte del exámen está por debajo del número de nota de corte mínimo del 30%.`
        );
        return errorReturnObject;
      }
      setTransformedScoreError(
        "La segunda parte del exámen está por debajo del número de nota de corte mínimo del 30%."
      );
      return errorReturnObject;
    }

    if (!!transformedScoreError) setTransformedScoreError(null);

    const transformedScoreFirstPart = formulaComputed(
      rawScorePart1,
      breakScorePart1,
      questionsPart1
    );
    const transformedScoreSecondPart = formulaComputed(
      rawScorePart2,
      breakScorePart2,
      questionsPart2
    );

    return {
      1: returnValueFixed(transformedScoreFirstPart),
      2: returnValueFixed(transformedScoreSecondPart),
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

  const handleResetWithCache = () => {
    if (!!cached) setTestState(cached);
  };

  const resetParagraphsState = () => {
    setLastTestResult(initialResultErrorState);
    setTestCalcError(initialResultErrorState);
    setTransformedScores({
      ...initialResultErrorState,
      overall: null,
    });
    setTransformedScoreError(null);
  };

  useEffect(() => {
    if (triggerUpdateCache) {
      const newLastTestsValuesCache = {
        ...lastTestsValuesCache,
        [isClasico ? "clasico" : "moderno"]: { ...testState },
      };
      handleCacheUpdate(newLastTestsValuesCache);
    }
    resetParagraphsState();
  }, [triggerUpdateCache]);

  // Because when changing kinds component does not unmount, we wait to the cached recomputation to apply cache to testState.
  useEffect(() => {
    handleResetWithCache();
  }, [lastTestsValuesCache]);

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

  const returnFieldMinValue = (fieldName) => {
    if (!fieldName.includes("break")) return;
    if (fieldName.includes("Part1"))
      return isClasico
        ? clasicoInfo.breakScoreDefaultPart1
        : modernoInfo.breakScoreDefaultPart1;
    if (fieldName.includes("Part2"))
      return isClasico
        ? clasicoInfo.breakScoreDefaultPart2
        : modernoInfo.breakScoreDefaultPart2;
  };

  const renderFieldGroupAndGroupErrors = (inputsArray, part) => {
    return (
      <div>
        <h3>Parte {part}ª:</h3>
        {inputsArray.map((input) => (
          <FormField
            name={input.name}
            value={!!testState[input.name] ? testState[input.name] : ""}
            min={returnFieldMinValue(input.name)}
            onChange={handleChange}
            labelText={input.labelText}
            key={input.name}
          />
        ))}
        {!!testCalcError[part] && (
          <p className="error" style={{ color: "red" }}>
            {testCalcError[part]}
          </p>
        )}
        {!!lastTestResult[part] && (
          <p style={{ color: lastTestResult[part] >= 5 ? "green" : "red" }}>
            Nota {part === 1 ? "primera" : "segunda"} parte:{" "}
            {lastTestResult[part]}
          </p>
        )}
        {!!transformedScores[part] && (
          <p
            style={{
              color: transformedScores[part] >= 25 ? "green" : "red",
            }}
          >
            Nota transformada de la {part === 1 ? "primera" : "segunda"} parte:{" "}
            {transformedScores[part]}
          </p>
        )}
      </div>
    );
  };

  return (
    <form id="Calculator" onSubmit={handleSubmit}>
      {renderFieldGroupAndGroupErrors(inputsArrayPart1, 1)}
      {renderFieldGroupAndGroupErrors(inputsArrayPart2, 2)}
      <button type="submit">Give it to me!</button>
      <h3>Notas transformadas:</h3>
      {transformedScores.overall && (
        <p
          style={{
            color: transformedScores.overall >= 25 ? "green" : "red",
          }}
        >
          Nota transformada: {transformedScores.overall}
        </p>
      )}
      {!!transformedScoreError && (
        <p className="error" style={{ color: "red" }}>
          {transformedScoreError}
        </p>
      )}
    </form>
  );
}

export default FormClasicoModerno;

function calculateRawScore(correct, wrong) {
  return correct - wrong / 3;
}

function formulaComputed(rawScore, breakScore, numberOfQuestions) {
  const weigth = 25;
  return (
    weigth * ((rawScore - breakScore) / (numberOfQuestions - breakScore)) +
    weigth
  );
}
