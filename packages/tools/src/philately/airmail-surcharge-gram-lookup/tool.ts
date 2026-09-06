import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  integer,
  money,
  roundMinor,
} from "../batch42-shared.js";
export type Input = Readonly<{
  readonly weightGrams: number;
  readonly callerStepGrams: number;
  readonly callerSurchargeMinorPerStep: number;
}>;
export type Output = Readonly<{
  readonly chargeableSteps: number;
  readonly airmailSurchargeMinor: number;
}>;
const inputFields = [
  { id: "weightGrams", label: "Weight grams", kind: "number" },
  { id: "callerStepGrams", label: "Caller step grams", kind: "number" },
  {
    id: "callerSurchargeMinorPerStep",
    label: "Caller surcharge minor per step",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerStepGrams, "callerStepGrams");
  nonnegative(input.weightGrams, "weightGrams");
  money(input.callerSurchargeMinorPerStep, "rate");
  const steps = integer(
    Math.ceil(input.weightGrams / input.callerStepGrams),
    "steps",
  );
  return {
    chargeableSteps: steps,
    airmailSurchargeMinor: roundMinor(
      BigInt(steps) * BigInt(input.callerSurchargeMinorPerStep),
      1n,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  weightGrams: 21,
  callerStepGrams: 20,
  callerSurchargeMinorPerStep: 50,
} satisfies Input;
export const exampleOutput = {
  chargeableSteps: 2,
  airmailSurchargeMinor: 100,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/airmail-surcharge-gram-lookup",
  title: "Airmail Uprate Surcharge per Gram Historical Lookup",
  description:
    "Calculate caller historically verified airmail surcharge in commenced weight steps; no embedded historical rate. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
  inputs: inputFields,
  outputs: [
    { id: "chargeableSteps", label: "Chargeable steps", kind: "number" },
    {
      id: "airmailSurchargeMinor",
      label: "Airmail surcharge minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      weightGrams: value.weightGrams as number,
      callerStepGrams: value.callerStepGrams as number,
      callerSurchargeMinorPerStep: value.callerSurchargeMinorPerStep as number,
    }),
});
export const run = tool.execute;
export default tool;
