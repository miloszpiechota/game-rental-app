import { useEffect, useState } from "react";

const resolveValue = <T,>(value: T | (() => T)) =>
  typeof value === "function" ? (value as () => T)() : value;

export const useLocalStorageState = <T,>(key: string, initialValue: T | (() => T)) => {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return resolveValue(initialValue);
    }

    const stored = window.localStorage.getItem(key);

    if (!stored) {
      return resolveValue(initialValue);
    }

    try {
      return JSON.parse(stored) as T;
    } catch {
      return resolveValue(initialValue);
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
};
