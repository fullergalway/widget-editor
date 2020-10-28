import { useCallback } from "react";
import debounce from 'lodash/debounce';

function useDebounce(callback, wait = 300) {
  const debouncedCallback = useCallback(
    debounce((...args) => callback(...args), wait),
    [wait, callback],
  );

  return debouncedCallback;
}

export default useDebounce;
