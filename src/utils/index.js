export function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

export function writeLocalStorageJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function readLocalStorageJSON(key) {
  return JSON.parse(localStorage.getItem(key));
}

export function fillInitialState(inputsArray) {
    return inputsArray.reduce((acc, inputInfo) => {
        acc[inputInfo.name] = "";
        return acc;
    }, {});
}

export function returnValueFixed(value) {
    return value % 1 !== 0 ? value.toFixed(1) : value;
  }

export function calculateScore({ numberOfQuestions, wrong, correct }) {
    const finalCorrect = correct - wrong / 3;
    const finalTestScore = (finalCorrect / numberOfQuestions) * 10;
    return returnValueFixed(finalTestScore);
  }
