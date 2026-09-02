import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly stellarMassSolar: number;
  readonly callerReferenceLifetimeYears: number;
  readonly callerMassLuminosityExponent: number;
}>;
export type Output = Readonly<{
  readonly conditionalMainSequenceLifetimeYears: number;
}>;
const inputFields = [
  { id: "stellarMassSolar", label: "Stellar mass solar", kind: "number" },
  {
    id: "callerReferenceLifetimeYears",
    label: "Caller reference lifetime years",
    kind: "number",
  },
  {
    id: "callerMassLuminosityExponent",
    label: "Caller mass luminosity exponent",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.stellarMassSolar, "stellarMassSolar");
  positive(input.callerReferenceLifetimeYears, "callerReferenceLifetimeYears");
  positive(input.callerMassLuminosityExponent, "callerMassLuminosityExponent");
  return {
    conditionalMainSequenceLifetimeYears:
      input.callerReferenceLifetimeYears *
      input.stellarMassSolar ** (1 - input.callerMassLuminosityExponent),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  stellarMassSolar: 2,
  callerReferenceLifetimeYears: 10000000000.0,
  callerMassLuminosityExponent: 3.5,
} satisfies Input;
export const exampleOutput = {
  conditionalMainSequenceLifetimeYears: 1767766952.966369,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/main-sequence-lifetime",
  title: "Main Sequence Lifetime Calculator",
  description:
    "Caller calibrated fuel∝mass and luminosity∝mass^exponent lifetime proxy, not universal stellar evolutionary track. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalMainSequenceLifetimeYears",
      label: "Conditional main sequence lifetime years",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      stellarMassSolar: value.stellarMassSolar as number,
      callerReferenceLifetimeYears:
        value.callerReferenceLifetimeYears as number,
      callerMassLuminosityExponent:
        value.callerMassLuminosityExponent as number,
    }),
});
export const run = tool.execute;
export default tool;
