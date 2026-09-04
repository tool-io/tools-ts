import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedCarriedMassKg: number;
  readonly bodyMassKg: number;
  readonly callerMassFractionLimit: number;
}>;
export type Output = Readonly<{
  readonly carriedBodyMassPercent: number;
  readonly signedMassReserveKg: number;
}>;
const inputFields = [
  {
    id: "observedCarriedMassKg",
    label: "Observed carried mass kg",
    kind: "number",
  },
  { id: "bodyMassKg", label: "Body mass kg", kind: "number" },
  {
    id: "callerMassFractionLimit",
    label: "Caller mass fraction limit",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.bodyMassKg, "bodyMassKg");
  nonnegative(input.observedCarriedMassKg, "observedCarriedMassKg");
  fraction(input.callerMassFractionLimit, "callerMassFractionLimit");
  return {
    carriedBodyMassPercent:
      (100 * input.observedCarriedMassKg) / input.bodyMassKg,
    signedMassReserveKg:
      input.bodyMassKg * input.callerMassFractionLimit -
      input.observedCarriedMassKg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCarriedMassKg: 20,
  bodyMassKg: 80,
  callerMassFractionLimit: 0.2,
} satisfies Input;
export const exampleOutput = {
  carriedBodyMassPercent: 25,
  signedMassReserveKg: -4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/carry-load-bodyweight-limit-checker",
  title: "Carrying Load Percent Body Weight Limit Checker",
  description:
    "Actual carried/body mass fraction against caller individual task limit; not carrying safety established by body-weight fraction. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "carriedBodyMassPercent",
      label: "Carried body mass percent",
      kind: "number",
    },
    {
      id: "signedMassReserveKg",
      label: "Signed mass reserve kg",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedCarriedMassKg: value.observedCarriedMassKg as number,
      bodyMassKg: value.bodyMassKg as number,
      callerMassFractionLimit: value.callerMassFractionLimit as number,
    }),
});
export const run = tool.execute;
export default tool;
