import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../shared.js";
export type Input = Readonly<{
  readonly fullSignedLineIndexes: readonly number[];
  readonly acquiredLineIndexes: readonly number[];
}>;
export type Output = Readonly<{
  readonly acquiredFraction: number;
  readonly symmetricPairedLineCount: number;
  readonly dcAcquired: boolean;
  readonly aboveHalfCoverage: boolean;
}>;
const inputFields = [
  {
    id: "fullSignedLineIndexes",
    label: "Full signed line indexes",
    kind: "numberList",
  },
  {
    id: "acquiredLineIndexes",
    label: "Acquired line indexes",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (!input.fullSignedLineIndexes.length || !input.acquiredLineIndexes.length)
    simpleError(
      "fullSignedLineIndexes",
      "Nonempty distinct full/acquired line indexes required.",
    );
  for (const row of [input.fullSignedLineIndexes, input.acquiredLineIndexes])
    if (
      row.some((v) => !Number.isSafeInteger(v)) ||
      new Set(row).size !== row.length
    )
      simpleError(
        "lineIndexes",
        "Distinct signed integer line indexes required.",
      );
  const full = new Set(input.fullSignedLineIndexes),
    acquired = new Set(input.acquiredLineIndexes);
  if (input.acquiredLineIndexes.some((v) => !full.has(v)))
    simpleError(
      "acquiredLineIndexes",
      "Acquired lines must lie within the full matrix.",
    );
  const acquiredFraction = acquired.size / full.size;
  return {
    acquiredFraction,
    symmetricPairedLineCount: input.acquiredLineIndexes.filter((v) =>
      acquired.has(-v),
    ).length,
    dcAcquired: acquired.has(0),
    aboveHalfCoverage: acquiredFraction > 0.5,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  fullSignedLineIndexes: [-4, -3, -2, -1, 0, 1, 2, 3],
  acquiredLineIndexes: [-1, 0, 1, 2, 3],
} satisfies Input;
export const exampleOutput = {
  acquiredFraction: 0.625,
  symmetricPairedLineCount: 3,
  dcAcquired: true,
  aboveHalfCoverage: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/asymmetric-partial-fourier-coverage",
  title: "Partial Fourier Factor",
  description:
    "Audit actual asymmetric signed-line coverage, conjugate pairs and DC availability; coverage above half alone does not guarantee successful partial-Fourier phase reconstruction.",
  inputs: inputFields,
  outputs: [
    { id: "acquiredFraction", label: "Acquired fraction", kind: "number" },
    {
      id: "symmetricPairedLineCount",
      label: "Symmetric paired line count",
      kind: "number",
    },
    { id: "dcAcquired", label: "Dc acquired", kind: "boolean" },
    { id: "aboveHalfCoverage", label: "Above half coverage", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      fullSignedLineIndexes: value.fullSignedLineIndexes as readonly number[],
      acquiredLineIndexes: value.acquiredLineIndexes as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
