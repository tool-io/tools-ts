import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedMatchedHeatExposureJm2: number;
  readonly callerVerifiedStandardFireHeatFluxWm2: number;
}>;
export type Output = Readonly<{
  readonly constantReferenceFireEquivalentSeconds: number;
}>;
const inputFields = [
  {
    id: "observedMatchedHeatExposureJm2",
    label: "Observed matched heat exposure jm2",
    kind: "number",
  },
  {
    id: "callerVerifiedStandardFireHeatFluxWm2",
    label: "Caller verified standard fire heat flux wm2",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerVerifiedStandardFireHeatFluxWm2,
    "callerVerifiedStandardFireHeatFluxWm2",
  );
  nonnegative(
    input.observedMatchedHeatExposureJm2,
    "observedMatchedHeatExposureJm2",
  );
  return {
    constantReferenceFireEquivalentSeconds:
      input.observedMatchedHeatExposureJm2 /
      input.callerVerifiedStandardFireHeatFluxWm2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedMatchedHeatExposureJm2: 100,
  callerVerifiedStandardFireHeatFluxWm2: 2,
} satisfies Input;
export const exampleOutput = {
  constantReferenceFireEquivalentSeconds: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/fire-time-equivalent",
  title: "Fire Time-Equivalent Calculator",
  description:
    "Heat-equivalent exposure against independently matched constant standard-fire flux approximation, not temperature-time area or structural fire-resistance rating. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "constantReferenceFireEquivalentSeconds",
      label: "Constant reference fire equivalent seconds",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedMatchedHeatExposureJm2:
        value.observedMatchedHeatExposureJm2 as number,
      callerVerifiedStandardFireHeatFluxWm2:
        value.callerVerifiedStandardFireHeatFluxWm2 as number,
    }),
});
export const run = tool.execute;
export default tool;
