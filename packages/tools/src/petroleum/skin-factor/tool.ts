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
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedWellDrawdownPa: number;
  readonly callerMatchedRadialPressureScalePa: number;
  readonly callerIndependentDrainageRadiusM: number;
  readonly observedWellboreRadiusM: number;
}>;
export type Output = Readonly<{ readonly apparentPseudoSteadySkin: number }>;
const inputFields = [
  {
    id: "observedWellDrawdownPa",
    label: "Observed well drawdown pa",
    kind: "number",
  },
  {
    id: "callerMatchedRadialPressureScalePa",
    label: "Caller matched radial pressure scale pa",
    kind: "number",
  },
  {
    id: "callerIndependentDrainageRadiusM",
    label: "Caller independent drainage radius m",
    kind: "number",
  },
  {
    id: "observedWellboreRadiusM",
    label: "Observed wellbore radius m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerMatchedRadialPressureScalePa,
    "callerMatchedRadialPressureScalePa",
  );
  positive(
    input.callerIndependentDrainageRadiusM,
    "callerIndependentDrainageRadiusM",
  );
  positive(input.observedWellboreRadiusM, "observedWellboreRadiusM");
  nonnegative(input.observedWellDrawdownPa, "observedWellDrawdownPa");
  if (input.callerIndependentDrainageRadiusM <= input.observedWellboreRadiusM)
    simpleError("radius", "Drainage radius>wellbore radius.");
  return {
    apparentPseudoSteadySkin:
      input.observedWellDrawdownPa / input.callerMatchedRadialPressureScalePa -
      Math.log(
        input.callerIndependentDrainageRadiusM / input.observedWellboreRadiusM,
      ) +
      0.75,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedWellDrawdownPa: 10,
  callerMatchedRadialPressureScalePa: 2,
  callerIndependentDrainageRadiusM: 100,
  observedWellboreRadiusM: 1,
} satisfies Input;
export const exampleOutput = {
  apparentPseudoSteadySkin: 1.1448298140119082,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/skin-factor",
  title: "Petroleum Skin Factor Calculator",
  description:
    "Named pseudo-steady radial drawdown inverse with natural-log geometry and.75 boundary constant, independently established pressure scale; signed apparent skin not causal damage diagnosis or transient Horner skin. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "apparentPseudoSteadySkin",
      label: "Apparent pseudo steady skin",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedWellDrawdownPa: value.observedWellDrawdownPa as number,
      callerMatchedRadialPressureScalePa:
        value.callerMatchedRadialPressureScalePa as number,
      callerIndependentDrainageRadiusM:
        value.callerIndependentDrainageRadiusM as number,
      observedWellboreRadiusM: value.observedWellboreRadiusM as number,
    }),
});
export const run = tool.execute;
export default tool;
