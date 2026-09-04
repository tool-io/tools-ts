import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly stressAmplitudePa: number;
  readonly callerFatigueStrengthCoefficientPa: number;
  readonly callerBasquinExponent: number;
}>;
export type Output = Readonly<{ readonly basquinCycles: number }>;
const inputFields = [
  { id: "stressAmplitudePa", label: "Stress amplitude pa", kind: "number" },
  {
    id: "callerFatigueStrengthCoefficientPa",
    label: "Caller fatigue strength coefficient pa",
    kind: "number",
  },
  {
    id: "callerBasquinExponent",
    label: "Caller basquin exponent",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.stressAmplitudePa, "stressAmplitudePa");
  positive(
    input.callerFatigueStrengthCoefficientPa,
    "callerFatigueStrengthCoefficientPa",
  );
  if (input.callerBasquinExponent >= 0)
    simpleError("b", "Negative Basquin exponent required.");
  return {
    basquinCycles:
      0.5 *
      (input.stressAmplitudePa / input.callerFatigueStrengthCoefficientPa) **
        (1 / input.callerBasquinExponent),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  stressAmplitudePa: 50,
  callerFatigueStrengthCoefficientPa: 100,
  callerBasquinExponent: -0.5,
} satisfies Input;
export const exampleOutput = { basquinCycles: 2 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/fatigue-life-basquin",
  title: "Basquin Fatigue Life Calculator",
  description:
    "Basquin elastic stress AMPLITUDE σa=σf′(2N)^b with negative calibrated b and explicit reversals. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [{ id: "basquinCycles", label: "Basquin cycles", kind: "number" }],
  calculate: (value) =>
    calculate({
      stressAmplitudePa: value.stressAmplitudePa as number,
      callerFatigueStrengthCoefficientPa:
        value.callerFatigueStrengthCoefficientPa as number,
      callerBasquinExponent: value.callerBasquinExponent as number,
    }),
});
export const run = tool.execute;
export default tool;
