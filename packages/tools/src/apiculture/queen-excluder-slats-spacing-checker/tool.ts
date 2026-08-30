import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  maximum,
  minimum,
} from "../shared.js";
export type Input = Readonly<{
  readonly workerWidthsMm: readonly number[];
  readonly queenWidthsMm: readonly number[];
  readonly slatGapsMm: readonly number[];
}>;
export type Output = Readonly<{
  readonly allSampleWorkersPassFlags: readonly number[];
  readonly allSampleQueensBlockedFlags: readonly number[];
  readonly sampleSelectiveGapFlags: readonly number[];
}>;
const inputFields = [
  { id: "workerWidthsMm", label: "Worker widths mm", kind: "numberList" },
  { id: "queenWidthsMm", label: "Queen widths mm", kind: "numberList" },
  { id: "slatGapsMm", label: "Slat gaps mm", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.workerWidthsMm.forEach((v) => positive(v, "workerWidthsMm"));
  input.queenWidthsMm.forEach((v) => positive(v, "queenWidthsMm"));
  input.slatGapsMm.forEach((v) => nonnegative(v, "slatGapsMm"));
  if (!input.slatGapsMm.length)
    simpleError("slatGapsMm", "Nonempty measured gaps required.");
  const worker = maximum(input.workerWidthsMm),
    queen = minimum(input.queenWidthsMm),
    allSampleWorkersPassFlags = input.slatGapsMm.map((g) =>
      g >= worker ? 1 : 0,
    ),
    allSampleQueensBlockedFlags = input.slatGapsMm.map((g) =>
      g < queen ? 1 : 0,
    );
  return {
    allSampleWorkersPassFlags,
    allSampleQueensBlockedFlags,
    sampleSelectiveGapFlags: allSampleWorkersPassFlags.map(
      (v, i) => v * allSampleQueensBlockedFlags[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  workerWidthsMm: [3, 4, 4],
  queenWidthsMm: [5, 6, 7],
  slatGapsMm: [3.5, 4.5, 5.5],
} satisfies Input;
export const exampleOutput = {
  allSampleWorkersPassFlags: [0, 1, 1],
  allSampleQueensBlockedFlags: [1, 1, 0],
  sampleSelectiveGapFlags: [0, 1, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/queen-excluder-slats-spacing-checker",
  title: "Queen Excluder Slats Spacing Checker",
  description:
    "Screen excluder gaps against measured worker maximum/queen minimum widths; sample selectivity is not a universal morphology rule or guarantee that bees pass in practice.",
  inputs: inputFields,
  outputs: [
    {
      id: "allSampleWorkersPassFlags",
      label: "All sample workers pass flags",
      kind: "numberList",
    },
    {
      id: "allSampleQueensBlockedFlags",
      label: "All sample queens blocked flags",
      kind: "numberList",
    },
    {
      id: "sampleSelectiveGapFlags",
      label: "Sample selective gap flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      workerWidthsMm: value.workerWidthsMm as readonly number[],
      queenWidthsMm: value.queenWidthsMm as readonly number[],
      slatGapsMm: value.slatGapsMm as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
