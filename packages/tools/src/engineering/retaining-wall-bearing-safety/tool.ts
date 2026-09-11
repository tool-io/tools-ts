import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly callerIndependentlyVerifiedBearingCapacity: number;
  readonly actualMaximumBasePressure: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerIndependentlyVerifiedBearingCapacity",
    label: "Caller independently verified bearing capacity",
    kind: "number",
  },
  {
    id: "actualMaximumBasePressure",
    label: "Actual maximum base pressure",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(
    input.callerIndependentlyVerifiedBearingCapacity,
    "callerIndependentlyVerifiedBearingCapacity",
  );
  positive(input.actualMaximumBasePressure, "actualMaximumBasePressure");
  return {
    value:
      input.callerIndependentlyVerifiedBearingCapacity /
      input.actualMaximumBasePressure,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerIndependentlyVerifiedBearingCapacity: 20,
    actualMaximumBasePressure: 10,
  },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/retaining-wall-bearing-safety",
  title: "Retaining Wall Bearing Safety Calculator",
  description:
    "Bearing capacity/actual independently established maximum contact pressure, not wall sliding or bearing-capacity derivation. Actual independently established compatible SI units/model context; conditional arithmetic, not code compliance, engineering design or safe operation approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
