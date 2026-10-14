import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualMassFlowKgPerSecond: number;
  readonly actualInletSpecificEnthalpyJoulesPerKg: number;
  readonly actualOutletSpecificEnthalpyJoulesPerKg: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualMassFlowKgPerSecond",
    label: "Actual mass flow kg per second",
    kind: "number",
  },
  {
    id: "actualInletSpecificEnthalpyJoulesPerKg",
    label: "Actual inlet specific enthalpy joules per kg",
    kind: "number",
  },
  {
    id: "actualOutletSpecificEnthalpyJoulesPerKg",
    label: "Actual outlet specific enthalpy joules per kg",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  nonnegative(input.actualMassFlowKgPerSecond, "actualMassFlowKgPerSecond");
  return {
    value:
      input.actualMassFlowKgPerSecond *
      (input.actualInletSpecificEnthalpyJoulesPerKg -
        input.actualOutletSpecificEnthalpyJoulesPerKg),
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualMassFlowKgPerSecond: 2,
    actualInletSpecificEnthalpyJoulesPerKg: 20,
    actualOutletSpecificEnthalpyJoulesPerKg: 10,
  },
  output: { result: { value: 20 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/turbine-work",
  title: "Turbine Work Calculator",
  description:
    "Actual turbine steady mass flow\u00d7signed inlet minus outlet specific enthalpy, same convention; heat/kinetic changes excluded. Actual independently established compatible SI units/model context; conditional arithmetic, not code compliance, engineering design or safe operation approval.",
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
