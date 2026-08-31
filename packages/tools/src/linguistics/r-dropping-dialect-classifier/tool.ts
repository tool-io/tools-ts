import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  binary,
  sum,
  bounded,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly callerRContextsPrevocalicPreconsonantalFinal: readonly number[];
  readonly observedRRetainedFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly prevocalicObservedRetentionPercent: number;
  readonly nonPrevocalicObservedRetentionPercent: number;
  readonly bothContextGroupsObserved: boolean;
  readonly matchesObservedNonrhoticPattern: boolean;
}>;
const inputFields = [
  {
    id: "callerRContextsPrevocalicPreconsonantalFinal",
    label: "Caller r contexts prevocalic preconsonantal final",
    kind: "numberList",
  },
  {
    id: "observedRRetainedFlags",
    label: "Observed r retained flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerRContextsPrevocalicPreconsonantalFinal,
    input.observedRRetainedFlags,
    "callerRContextsPrevocalicPreconsonantalFinal",
  );
  input.callerRContextsPrevocalicPreconsonantalFinal.forEach((v) =>
    bounded(v, "context", 0, 2),
  );
  binary(input.observedRRetainedFlags, "retention");
  const pre = input.observedRRetainedFlags.filter(
      (_, i) => input.callerRContextsPrevocalicPreconsonantalFinal[i] === 0,
    ),
    non = input.observedRRetainedFlags.filter(
      (_, i) => input.callerRContextsPrevocalicPreconsonantalFinal[i] !== 0,
    ),
    both = pre.length > 0 && non.length > 0;
  return {
    prevocalicObservedRetentionPercent: pre.length
      ? (100 * sum(pre)) / pre.length
      : -1,
    nonPrevocalicObservedRetentionPercent: non.length
      ? (100 * sum(non)) / non.length
      : -1,
    bothContextGroupsObserved: both,
    matchesObservedNonrhoticPattern:
      both && pre.every((v) => v === 1) && non.every((v) => v === 0),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerRContextsPrevocalicPreconsonantalFinal: [0, 1, 2],
  observedRRetainedFlags: [1, 0, 0],
} satisfies Input;
export const exampleOutput = {
  prevocalicObservedRetentionPercent: 100,
  nonPrevocalicObservedRetentionPercent: 0,
  bothContextGroupsObserved: true,
  matchesObservedNonrhoticPattern: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/r-dropping-dialect-classifier",
  title: "R-Dropping Dialect Classifier",
  description:
    "Screen explicitly observed r retention by annotated prevocalic versus nonprevocalic contexts, preserving missing-context evidence; no region/dialect assignment, linking-r/intrusive-r modeling or audio diagnosis.",
  inputs: inputFields,
  outputs: [
    {
      id: "prevocalicObservedRetentionPercent",
      label: "Prevocalic observed retention percent",
      kind: "number",
    },
    {
      id: "nonPrevocalicObservedRetentionPercent",
      label: "Non prevocalic observed retention percent",
      kind: "number",
    },
    {
      id: "bothContextGroupsObserved",
      label: "Both context groups observed",
      kind: "boolean",
    },
    {
      id: "matchesObservedNonrhoticPattern",
      label: "Matches observed nonrhotic pattern",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      callerRContextsPrevocalicPreconsonantalFinal:
        value.callerRContextsPrevocalicPreconsonantalFinal as readonly number[],
      observedRRetainedFlags: value.observedRRetainedFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
