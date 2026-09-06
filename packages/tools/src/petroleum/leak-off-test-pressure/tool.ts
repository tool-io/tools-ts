import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedAlreadyCompletedLeakOffSurfacePa: readonly number[];
  readonly observedIndependentShoeHydrostaticPa: readonly number[];
  readonly observedIndependentGaugeOffsetsPa: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedGaugeCorrectedShoeLeakOffPa: readonly number[];
}>;
const inputFields = [
  {
    id: "observedAlreadyCompletedLeakOffSurfacePa",
    label: "Observed already completed leak off surface pa",
    kind: "numberList",
  },
  {
    id: "observedIndependentShoeHydrostaticPa",
    label: "Observed independent shoe hydrostatic pa",
    kind: "numberList",
  },
  {
    id: "observedIndependentGaugeOffsetsPa",
    label: "Observed independent gauge offsets pa",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedAlreadyCompletedLeakOffSurfacePa.forEach((v) =>
    nonnegative(v, "observedAlreadyCompletedLeakOffSurfacePa"),
  );
  input.observedIndependentShoeHydrostaticPa.forEach((v) =>
    nonnegative(v, "observedIndependentShoeHydrostaticPa"),
  );
  aligned(
    input.observedAlreadyCompletedLeakOffSurfacePa,
    input.observedIndependentShoeHydrostaticPa,
    "observedAlreadyCompletedLeakOffSurfacePa",
  );
  aligned(
    input.observedAlreadyCompletedLeakOffSurfacePa,
    input.observedIndependentGaugeOffsetsPa,
    "observedAlreadyCompletedLeakOffSurfacePa",
  );
  return {
    observedGaugeCorrectedShoeLeakOffPa:
      input.observedAlreadyCompletedLeakOffSurfacePa.map(
        (v, i) =>
          v -
          input.observedIndependentGaugeOffsetsPa[i] +
          input.observedIndependentShoeHydrostaticPa[i],
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAlreadyCompletedLeakOffSurfacePa: [10, 20],
  observedIndependentShoeHydrostaticPa: [30, 40],
  observedIndependentGaugeOffsetsPa: [1, 2],
} satisfies Input;
export const exampleOutput = {
  observedGaugeCorrectedShoeLeakOffPa: [39, 58],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/leak-off-test-pressure",
  title: "Petroleum Leak Off Test Pressure Calculator",
  description:
    "Audit already observed leak-off surface readings translated with independent shoe hydrostatic/gauge calibration, not pressure testing instructions or fracture strength inferred from a curve. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedGaugeCorrectedShoeLeakOffPa",
      label: "Observed gauge corrected shoe leak off pa",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedAlreadyCompletedLeakOffSurfacePa:
        value.observedAlreadyCompletedLeakOffSurfacePa as readonly number[],
      observedIndependentShoeHydrostaticPa:
        value.observedIndependentShoeHydrostaticPa as readonly number[],
      observedIndependentGaugeOffsetsPa:
        value.observedIndependentGaugeOffsetsPa as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
