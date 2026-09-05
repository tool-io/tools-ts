import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  crossings,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly sampleDepths: readonly number[];
  readonly observedDelta13C: readonly number[];
  readonly independentBaselineDelta13C: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedExcursions: readonly number[];
  readonly zeroCrossingDepths: readonly number[];
}>;
const inputFields = [
  { id: "sampleDepths", label: "Sample depths", kind: "numberList" },
  { id: "observedDelta13C", label: "Observed delta13 c", kind: "numberList" },
  {
    id: "independentBaselineDelta13C",
    label: "Independent baseline delta13 c",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(input.sampleDepths, input.observedDelta13C, "sampleDepths");
  aligned(
    input.sampleDepths,
    input.independentBaselineDelta13C,
    "sampleDepths",
  );
  const d = input.observedDelta13C.map(
    (v, i) => v - input.independentBaselineDelta13C[i],
  );
  return {
    signedExcursions: d,
    zeroCrossingDepths: crossings(input.sampleDepths, d, 0),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  sampleDepths: [0, 1, 2],
  observedDelta13C: [1, -1, 1],
  independentBaselineDelta13C: [0, 0, 0],
} satisfies Input;
export const exampleOutput = {
  signedExcursions: [1, -1, 1],
  zeroCrossingDepths: [0.5, 1.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/chemostratigraphy-carbon-isotope-excursion",
  title: "Geology Chemostratigraphy Carbon Isotope Excursion Calculator",
  description:
    "Observed baseline-relative carbon isotope excursions and actual sampled zero-crossings, no named global-event correlation. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    { id: "signedExcursions", label: "Signed excursions", kind: "numberList" },
    {
      id: "zeroCrossingDepths",
      label: "Zero crossing depths",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      sampleDepths: value.sampleDepths as readonly number[],
      observedDelta13C: value.observedDelta13C as readonly number[],
      independentBaselineDelta13C:
        value.independentBaselineDelta13C as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
