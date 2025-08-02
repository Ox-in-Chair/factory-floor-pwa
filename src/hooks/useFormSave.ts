import { useEffect, useRef } from "react";
import { debounce } from "../utils/debounce";
import { idbSet } from "../utils/indexeddb";

export function useFormAutoSave(key: string, validate: () => boolean, getData: () => unknown) {
  const save = useRef(
    debounce(async () => {
      if (validate()) {
        await idbSet(key, getData());
      }
    }, 500)
  );

  useEffect(() => {
    // optional: flush on unmount if needed
    return () => {
      // no-op
    };
  }, []);

  return {
    triggerSave: () => save.current()
  };
}
