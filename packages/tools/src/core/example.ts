export type ToolExample<Input, Output = never> = {
  readonly input: Input;
  readonly output?: Output;
};

const numericTolerance = 64 * Number.EPSILON;

const numbersMatch = (actual: number, expected: number): boolean => {
  if (Object.is(actual, expected)) return true;
  if (!Number.isFinite(actual) || !Number.isFinite(expected)) return false;
  const scale = Math.max(1, Math.abs(actual), Math.abs(expected));
  return Math.abs(actual - expected) <= scale * numericTolerance;
};

/**
 * Compares JSON-compatible example output while allowing bounded floating-point
 * variation from arithmetic and transcendental functions across JS engines.
 * Structure and nonnumeric values remain exact.
 */
export const exampleOutputsMatch = (
  actual: unknown,
  expected: unknown,
): boolean => {
  if (typeof actual === "number" && typeof expected === "number")
    return numbersMatch(actual, expected);
  if (Object.is(actual, expected)) return true;
  if (Array.isArray(actual) || Array.isArray(expected))
    return (
      Array.isArray(actual) &&
      Array.isArray(expected) &&
      actual.length === expected.length &&
      actual.every((value, index) =>
        exampleOutputsMatch(value, expected[index]),
      )
    );
  if (
    typeof actual !== "object" ||
    actual === null ||
    typeof expected !== "object" ||
    expected === null
  )
    return false;
  const actualRecord = actual as Record<string, unknown>;
  const expectedRecord = expected as Record<string, unknown>;
  const keys = Object.keys(actualRecord);
  return (
    keys.length === Object.keys(expectedRecord).length &&
    keys.every(
      (key) =>
        Object.hasOwn(expectedRecord, key) &&
        exampleOutputsMatch(actualRecord[key], expectedRecord[key]),
    )
  );
};
