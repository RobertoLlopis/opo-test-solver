import { useCalculatorSelectedContext } from "../contexts/CalculatorSelectedContext";
import { useLastTestValuesContext } from "../contexts/LastTestsValuesContext";
import { writeLocalStorageJSON } from "../utils";

export default function useUpdateCache() {
    const { setCalculatorSelected } = useCalculatorSelectedContext();
    const { setLastTestsValuesCache, kindToGo, resetTriggerUpdateAndKinToGo } = useLastTestValuesContext();
    
    const handleCacheUpdate = (newLastTestsValuesCache) => {

        writeLocalStorageJSON("lastTestsValuesCache", newLastTestsValuesCache);
        setLastTestsValuesCache(newLastTestsValuesCache);

        setCalculatorSelected(kindToGo);
        resetTriggerUpdateAndKinToGo();
    };
    return {handleCacheUpdate};
} 