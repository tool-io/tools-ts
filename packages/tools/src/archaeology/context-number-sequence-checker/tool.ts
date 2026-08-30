import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, count } from "../shared.js";
export type Input = Readonly<{
  readonly recordedContextNumbers: readonly number[];
  readonly expectedFirstNumber: number;
  readonly expectedLastNumber: number;
}>;
export type Output = Readonly<{
  readonly missingContextNumbers: readonly number[];
  readonly duplicateContextNumbers: readonly number[];
  readonly outsideExpectedContextNumbers: readonly number[];
}>;
const inputFields = [
  {
    id: "recordedContextNumbers",
    label: "Recorded context numbers",
    kind: "numberList",
  },
  {
    id: "expectedFirstNumber",
    label: "Expected first number",
    kind: "integer",
  },
  { id: "expectedLastNumber", label: "Expected last number", kind: "integer" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.recordedContextNumbers.forEach((v) =>
    count(v, "recordedContextNumbers"),
  );
  count(input.expectedFirstNumber, "expectedFirstNumber");
  count(input.expectedLastNumber, "expectedLastNumber");
  const n = input.expectedLastNumber - input.expectedFirstNumber + 1;
  if (n < 1 || n > 10000)
    simpleError(
      "range",
      "Ordered bounded expected range of at most 10000 IDs required.",
    );
  const counts = new Map<number, number>();
  input.recordedContextNumbers.forEach((v) =>
    counts.set(v, (counts.get(v) ?? 0) + 1),
  );
  return {
    missingContextNumbers: Array.from(
      { length: n },
      (_, i) => input.expectedFirstNumber + i,
    ).filter((v) => !counts.has(v)),
    duplicateContextNumbers: [...counts]
      .filter(([, v]) => v > 1)
      .map(([k]) => k)
      .sort((a, b) => a - b),
    outsideExpectedContextNumbers: [...counts.keys()]
      .filter(
        (v) => v < input.expectedFirstNumber || v > input.expectedLastNumber,
      )
      .sort((a, b) => a - b),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  recordedContextNumbers: [10, 12, 12, 9],
  expectedFirstNumber: 10,
  expectedLastNumber: 13,
} satisfies Input;
export const exampleOutput = {
  missingContextNumbers: [11, 13],
  duplicateContextNumbers: [12],
  outsideExpectedContextNumbers: [9],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/context-number-sequence-checker",
  title: "Context Number Sequence Checker",
  description:
    "Audit observed context IDs for missing expected numbers, duplicates and outside-range IDs; omissions do not establish lost archaeological contexts.",
  inputs: inputFields,
  outputs: [
    {
      id: "missingContextNumbers",
      label: "Missing context numbers",
      kind: "numberList",
    },
    {
      id: "duplicateContextNumbers",
      label: "Duplicate context numbers",
      kind: "numberList",
    },
    {
      id: "outsideExpectedContextNumbers",
      label: "Outside expected context numbers",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      recordedContextNumbers: value.recordedContextNumbers as readonly number[],
      expectedFirstNumber: value.expectedFirstNumber as number,
      expectedLastNumber: value.expectedLastNumber as number,
    }),
});
export const run = tool.execute;
export default tool;
