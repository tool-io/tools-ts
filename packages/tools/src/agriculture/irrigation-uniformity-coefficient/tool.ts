import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
  weights,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedIrrigationCatchDepthsMm: readonly number[];
  readonly callerCatchAreaWeights: readonly number[];
}>;
export type Output = Readonly<{
  readonly areaWeightedChristiansenCuFraction: number;
}>;
const inputFields = [
  {
    id: "observedIrrigationCatchDepthsMm",
    label: "Observed irrigation catch depths mm",
    kind: "numberList",
  },
  {
    id: "callerCatchAreaWeights",
    label: "Caller catch area weights",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerCatchAreaWeights.forEach((v) =>
    positive(v, "callerCatchAreaWeights"),
  );
  input.observedIrrigationCatchDepthsMm.forEach((v) =>
    nonnegative(v, "observedIrrigationCatchDepthsMm"),
  );
  aligned(
    input.observedIrrigationCatchDepthsMm,
    input.callerCatchAreaWeights,
    "observedIrrigationCatchDepthsMm",
  );
  const w = weights(input.callerCatchAreaWeights),
    m = sum(input.observedIrrigationCatchDepthsMm.map((v, i) => v * w[i]));
  positive(m, "mean catch");
  return {
    areaWeightedChristiansenCuFraction:
      1 -
      sum(
        input.observedIrrigationCatchDepthsMm.map(
          (v, i) => Math.abs(v - m) * w[i],
        ),
      ) /
        m,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedIrrigationCatchDepthsMm: [1, 2, 3],
  callerCatchAreaWeights: [1, 1, 2],
} satisfies Input;
export const exampleOutput = {
  areaWeightedChristiansenCuFraction: 0.6666666666666666,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/irrigation-uniformity-coefficient",
  title: "Agriculture Irrigation Uniformity Coefficient Calculator",
  description:
    "Area-weighted Christiansen absolute-deviation uniformity, signed poor-uniformity values retained; not low-quarter DU. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "areaWeightedChristiansenCuFraction",
      label: "Area weighted christiansen cu fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedIrrigationCatchDepthsMm:
        value.observedIrrigationCatchDepthsMm as readonly number[],
      callerCatchAreaWeights: value.callerCatchAreaWeights as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
