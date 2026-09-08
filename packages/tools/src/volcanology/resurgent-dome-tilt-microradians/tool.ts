import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, aligned } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedDomeDifferentialRiseM: readonly number[];
  readonly observedTiltBaselineM: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedResurgentTiltMicroradians: readonly number[];
}>;
const inputFields = [
  {
    id: "observedDomeDifferentialRiseM",
    label: "Observed dome differential rise m",
    kind: "numberList",
  },
  {
    id: "observedTiltBaselineM",
    label: "Observed tilt baseline m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedTiltBaselineM.forEach((v) =>
    positive(v, "observedTiltBaselineM"),
  );
  aligned(
    input.observedDomeDifferentialRiseM,
    input.observedTiltBaselineM,
    "observedDomeDifferentialRiseM",
  );
  return {
    observedResurgentTiltMicroradians: input.observedDomeDifferentialRiseM.map(
      (v, i) => 1e6 * Math.atan(v / input.observedTiltBaselineM[i]),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDomeDifferentialRiseM: [0.001, 0.004],
  observedTiltBaselineM: [10, 20],
} satisfies Input;
export const exampleOutput = {
  observedResurgentTiltMicroradians: [99.99999966666667, 199.9999973333334],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/resurgent-dome-tilt-microradians",
  title: "Resurgent Dome Tilt Microradians Calculator",
  description:
    "Actual finite-baseline angular tilt atan(Δh/L) in microradians, not small-angle exactness or uplift-only rate. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedResurgentTiltMicroradians",
      label: "Observed resurgent tilt microradians",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDomeDifferentialRiseM:
        value.observedDomeDifferentialRiseM as readonly number[],
      observedTiltBaselineM: value.observedTiltBaselineM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
