import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly callerCalibratedFanSystemResistance: number;
  readonly actualAirFlow: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerCalibratedFanSystemResistance",
    label: "Caller calibrated fan system resistance",
    kind: "number",
  },
  { id: "actualAirFlow", label: "Actual air flow", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.callerCalibratedFanSystemResistance,
    "callerCalibratedFanSystemResistance",
  );
  nonnegative(input.actualAirFlow, "actualAirFlow");
  return {
    value: input.callerCalibratedFanSystemResistance * input.actualAirFlow ** 2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { callerCalibratedFanSystemResistance: 1, actualAirFlow: 2 },
  output: { result: { value: 4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/fan-system-curve",
  title: "Fan System Curve Calculator",
  description:
    "Declared calibrated fan static pressure kQ\u00b2, same density/flow conditions; no flow selection, fan curve intersection or motor rating. Actual independently established compatible SI units/model context; conditional arithmetic, not code compliance, engineering design or safe operation approval.",
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
