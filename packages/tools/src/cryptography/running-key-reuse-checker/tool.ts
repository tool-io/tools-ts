import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, bounded, letters } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly keyStreamA: string;
  readonly keyStreamB: string;
  readonly minimumMatchingRun: number;
}>;
export type Output = Readonly<{
  readonly matchingRunStartIndices: readonly number[];
  readonly matchingRunLengths: readonly number[];
}>;
const inputFields = [
  { id: "keyStreamA", label: "Key stream a", kind: "string" },
  { id: "keyStreamB", label: "Key stream b", kind: "string" },
  { id: "minimumMatchingRun", label: "Minimum matching run", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  letters(input.keyStreamA);
  letters(input.keyStreamB);
  bounded(input.minimumMatchingRun, "minimum", 1, 128);
  if (input.keyStreamA.length !== input.keyStreamB.length)
    simpleError(
      "streams",
      "Aligned explicitly positioned key-stream evidence required.",
    );
  const starts: number[] = [],
    lengths: number[] = [];
  let at = -1;
  for (let i = 0; i <= input.keyStreamA.length; i++) {
    if (
      i < input.keyStreamA.length &&
      input.keyStreamA[i] === input.keyStreamB[i]
    ) {
      if (at < 0) at = i;
    } else if (at >= 0) {
      if (i - at >= input.minimumMatchingRun) {
        starts.push(at);
        lengths.push(i - at);
      }
      at = -1;
    }
  }
  return { matchingRunStartIndices: starts, matchingRunLengths: lengths };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  keyStreamA: "ABCDEF",
  keyStreamB: "ZZCDEZ",
  minimumMatchingRun: 3,
} satisfies Input;
export const exampleOutput = {
  matchingRunStartIndices: [2],
  matchingRunLengths: [3],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/running-key-reuse-checker",
  title: "Running-Key Reuse Detector",
  description:
    "Locate exact aligned key-stream matching runs, evidence of matches not proof of insecure reuse or recovery of unavailable keys.",
  inputs: inputFields,
  outputs: [
    {
      id: "matchingRunStartIndices",
      label: "Matching run start indices",
      kind: "numberList",
    },
    {
      id: "matchingRunLengths",
      label: "Matching run lengths",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      keyStreamA: value.keyStreamA as string,
      keyStreamB: value.keyStreamB as string,
      minimumMatchingRun: value.minimumMatchingRun as number,
    }),
});
export const run = tool.execute;
export default tool;
