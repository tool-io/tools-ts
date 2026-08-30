import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, count } from "../shared.js";
export type Input = Readonly<{
  readonly fullPhaseLines: number;
  readonly nominalStride: number;
  readonly acsStartIndex: number;
  readonly acsLineCount: number;
}>;
export type Output = Readonly<{
  readonly acquiredLineIndexes: readonly number[];
  readonly acquiredLineCount: number;
  readonly effectiveAcceleration: number;
}>;
const inputFields = [
  { id: "fullPhaseLines", label: "Full phase lines", kind: "integer" },
  { id: "nominalStride", label: "Nominal stride", kind: "integer" },
  { id: "acsStartIndex", label: "Acs start index", kind: "integer" },
  { id: "acsLineCount", label: "Acs line count", kind: "integer" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  count(input.fullPhaseLines, "fullPhaseLines", 1);
  count(input.nominalStride, "nominalStride", 1);
  count(input.acsStartIndex, "acsStartIndex");
  count(input.acsLineCount, "acsLineCount");
  if (
    input.fullPhaseLines > 100000 ||
    input.acsStartIndex + input.acsLineCount > input.fullPhaseLines
  )
    simpleError(
      "acsLineCount",
      "ACS interval must lie within a bounded full phase matrix.",
    );
  const acquiredLineIndexes = Array.from(
    { length: input.fullPhaseLines },
    (_, i) => i,
  ).filter(
    (i) =>
      i % input.nominalStride === 0 ||
      (i >= input.acsStartIndex &&
        i < input.acsStartIndex + input.acsLineCount),
  );
  return {
    acquiredLineIndexes,
    acquiredLineCount: acquiredLineIndexes.length,
    effectiveAcceleration: input.fullPhaseLines / acquiredLineIndexes.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  fullPhaseLines: 128,
  nominalStride: 4,
  acsStartIndex: 48,
  acsLineCount: 32,
} satisfies Input;
export const exampleOutput = {
  acquiredLineIndexes: [
    0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 49, 50, 51, 52, 53, 54, 55,
    56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74,
    75, 76, 77, 78, 79, 80, 84, 88, 92, 96, 100, 104, 108, 112, 116, 120, 124,
  ],
  acquiredLineCount: 56,
  effectiveAcceleration: 2.2857142857142856,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/grappa-acs-line-acceleration",
  title: "GRAPPA Acceleration",
  description:
    "Count unique regularly subsampled phase lines plus a contiguous ACS interval, avoiding double counting; GRAPPA kernel fitting and reconstruction are not performed.",
  inputs: inputFields,
  outputs: [
    {
      id: "acquiredLineIndexes",
      label: "Acquired line indexes",
      kind: "numberList",
    },
    { id: "acquiredLineCount", label: "Acquired line count", kind: "number" },
    {
      id: "effectiveAcceleration",
      label: "Effective acceleration",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      fullPhaseLines: value.fullPhaseLines as number,
      nominalStride: value.nominalStride as number,
      acsStartIndex: value.acsStartIndex as number,
      acsLineCount: value.acsLineCount as number,
    }),
});
export const run = tool.execute;
export default tool;
