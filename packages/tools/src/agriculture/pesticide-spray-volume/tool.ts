import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedAlreadyAppliedSprayLiters: readonly number[];
  readonly observedMatchedTreatedAreasHa: readonly number[];
  readonly observedSprayElapsedMinutes: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedSprayLitersPerHa: number;
  readonly observedSprayLitersPerMinute: number;
}>;
const inputFields = [
  {
    id: "observedAlreadyAppliedSprayLiters",
    label: "Observed already applied spray liters",
    kind: "numberList",
  },
  {
    id: "observedMatchedTreatedAreasHa",
    label: "Observed matched treated areas ha",
    kind: "numberList",
  },
  {
    id: "observedSprayElapsedMinutes",
    label: "Observed spray elapsed minutes",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMatchedTreatedAreasHa.forEach((v) =>
    positive(v, "observedMatchedTreatedAreasHa"),
  );
  input.observedSprayElapsedMinutes.forEach((v) =>
    positive(v, "observedSprayElapsedMinutes"),
  );
  input.observedAlreadyAppliedSprayLiters.forEach((v) =>
    nonnegative(v, "observedAlreadyAppliedSprayLiters"),
  );
  aligned(
    input.observedAlreadyAppliedSprayLiters,
    input.observedMatchedTreatedAreasHa,
    "observedAlreadyAppliedSprayLiters",
  );
  aligned(
    input.observedAlreadyAppliedSprayLiters,
    input.observedSprayElapsedMinutes,
    "observedAlreadyAppliedSprayLiters",
  );
  return {
    observedSprayLitersPerHa:
      sum(input.observedAlreadyAppliedSprayLiters) /
      sum(input.observedMatchedTreatedAreasHa),
    observedSprayLitersPerMinute:
      sum(input.observedAlreadyAppliedSprayLiters) /
      sum(input.observedSprayElapsedMinutes),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAlreadyAppliedSprayLiters: [10, 20],
  observedMatchedTreatedAreasHa: [1, 2],
  observedSprayElapsedMinutes: [2, 5],
} satisfies Input;
export const exampleOutput = {
  observedSprayLitersPerHa: 10,
  observedSprayLitersPerMinute: 4.285714285714286,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/pesticide-spray-volume",
  title: "Agriculture Pesticide Spray Volume Calculator",
  description:
    "Audit already-applied spray carrier volume and field/time exposure only, no pesticide dosing or application recommendation. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedSprayLitersPerHa",
      label: "Observed spray liters per ha",
      kind: "number",
    },
    {
      id: "observedSprayLitersPerMinute",
      label: "Observed spray liters per minute",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedAlreadyAppliedSprayLiters:
        value.observedAlreadyAppliedSprayLiters as readonly number[],
      observedMatchedTreatedAreasHa:
        value.observedMatchedTreatedAreasHa as readonly number[],
      observedSprayElapsedMinutes:
        value.observedSprayElapsedMinutes as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
