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
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly grainDiametersMm: readonly number[];
  readonly grainMassWeights: readonly number[];
}>;
export type Output = Readonly<{
  readonly phi: readonly number[];
  readonly weightedMeanPhi: number;
}>;
const inputFields = [
  { id: "grainDiametersMm", label: "Grain diameters mm", kind: "numberList" },
  { id: "grainMassWeights", label: "Grain mass weights", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.grainDiametersMm.forEach((v) => positive(v, "grainDiametersMm"));
  input.grainMassWeights.forEach((v) => nonnegative(v, "grainMassWeights"));
  aligned(input.grainDiametersMm, input.grainMassWeights, "grainDiametersMm");
  const p = input.grainDiametersMm.map((d) => -Math.log2(d)),
    w = weights(input.grainMassWeights);
  return { phi: p, weightedMeanPhi: sum(p.map((v, i) => v * w[i])) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  grainDiametersMm: [0.5, 1, 2],
  grainMassWeights: [1, 2, 1],
} satisfies Input;
export const exampleOutput = {
  phi: [1, 0, -1],
  weightedMeanPhi: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/wentworth-grain-size-phi",
  title: "Geology Wentworth Grain Size Phi Calculator",
  description:
    "Actual weighted grain distribution phi=−log2(d/mm), signed coarse coordinates retained. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    { id: "phi", label: "Phi", kind: "numberList" },
    { id: "weightedMeanPhi", label: "Weighted mean phi", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      grainDiametersMm: value.grainDiametersMm as readonly number[],
      grainMassWeights: value.grainMassWeights as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
