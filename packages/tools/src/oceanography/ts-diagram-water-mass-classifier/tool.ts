import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative, aligned } from "../shared.js";
export type Input = Readonly<{
  readonly sampleTemperaturesC: readonly number[];
  readonly sampleSalinities: readonly number[];
  readonly waterMassBounds: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly membershipFlags: readonly (readonly number[])[];
  readonly matchCounts: readonly number[];
}>;
const inputFields = [
  {
    id: "sampleTemperaturesC",
    label: "Sample temperatures c",
    kind: "numberList",
  },
  { id: "sampleSalinities", label: "Sample salinities", kind: "numberList" },
  { id: "waterMassBounds", label: "Water mass bounds", kind: "matrix" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.sampleSalinities.forEach((v) => nonnegative(v, "sampleSalinities"));
  aligned(
    input.sampleTemperaturesC,
    input.sampleSalinities,
    "sampleTemperaturesC",
  );
  if (
    !input.waterMassBounds.length ||
    input.sampleTemperaturesC.length * input.waterMassBounds.length > 1000000 ||
    input.waterMassBounds.some(
      (b) => b.length !== 4 || b[0] > b[1] || b[2] < 0 || b[2] > b[3],
    )
  )
    simpleError(
      "waterMassBounds",
      "Bounded [Tmin,Tmax,Smin,Smax] rectangles required.",
    );
  if (input.sampleTemperaturesC.length > 128)
    simpleError(
      "samples",
      "At most 128 samples supported in membership matrix.",
    );
  const membershipFlags: number[][] = input.sampleTemperaturesC.map((t, i) =>
    input.waterMassBounds.map((b) =>
      t >= b[0] &&
      t <= b[1] &&
      input.sampleSalinities[i] >= b[2] &&
      input.sampleSalinities[i] <= b[3]
        ? 1
        : 0,
    ),
  );
  return {
    membershipFlags,
    matchCounts: membershipFlags.map((row) => row.reduce((a, b) => a + b, 0)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  sampleTemperaturesC: [5, 10, 20],
  sampleSalinities: [30, 35, 40],
  waterMassBounds: [
    [0, 10, 25, 35],
    [5, 15, 30, 40],
  ],
} satisfies Input;
export const exampleOutput = {
  membershipFlags: [
    [1, 1],
    [1, 1],
    [0, 0],
  ],
  matchCounts: [2, 2, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/ts-diagram-water-mass-classifier",
  title: "TS Diagram Water Mass Classifier",
  description:
    "Screen TS samples against caller rectangular water-mass bands, preserving overlaps and unmatched states; no geographic water-mass reference database or forced single identity.",
  inputs: inputFields,
  outputs: [
    { id: "membershipFlags", label: "Membership flags", kind: "matrix" },
    { id: "matchCounts", label: "Match counts", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      sampleTemperaturesC: value.sampleTemperaturesC as readonly number[],
      sampleSalinities: value.sampleSalinities as readonly number[],
      waterMassBounds: value.waterMassBounds as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
