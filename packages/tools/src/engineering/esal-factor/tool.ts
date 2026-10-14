import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualAxleLoad: number;
  readonly callerIndependentlyApplicableReferenceAxleLoad: number;
  readonly callerCalibratedDamageExponent: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "actualAxleLoad", label: "Actual axle load", kind: "number" },
  {
    id: "callerIndependentlyApplicableReferenceAxleLoad",
    label: "Caller independently applicable reference axle load",
    kind: "number",
  },
  {
    id: "callerCalibratedDamageExponent",
    label: "Caller calibrated damage exponent",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  nonnegative(input.actualAxleLoad, "actualAxleLoad");
  positive(
    input.callerIndependentlyApplicableReferenceAxleLoad,
    "callerIndependentlyApplicableReferenceAxleLoad",
  );
  positive(
    input.callerCalibratedDamageExponent,
    "callerCalibratedDamageExponent",
  );
  return {
    value:
      (input.actualAxleLoad /
        input.callerIndependentlyApplicableReferenceAxleLoad) **
      input.callerCalibratedDamageExponent,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualAxleLoad: 2,
    callerIndependentlyApplicableReferenceAxleLoad: 1,
    callerCalibratedDamageExponent: 4,
  },
  output: { result: { value: 16 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/esal-factor",
  title: "ESAL Factor Calculator",
  description:
    "Explicit independently calibrated axle load power law ESAL scenario, pavement/axle configuration and reference external; not universal fourth power traffic authority. Actual independently established compatible SI units/model context; conditional arithmetic, not code compliance, engineering design or safe operation approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "number" } },
        required: ["value"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
