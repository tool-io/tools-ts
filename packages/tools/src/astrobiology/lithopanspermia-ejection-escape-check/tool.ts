import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredEjectionSpeedMetersPerSecond: number;
  readonly callerVerifiedEscapeSpeedMetersPerSecond: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredEjectionSpeedMetersPerSecond",
    label: "Independently measured ejection speed meters per second",
    kind: "number",
  },
  {
    id: "callerVerifiedEscapeSpeedMetersPerSecond",
    label: "Caller verified escape speed meters per second",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.independentlyMeasuredEjectionSpeedMetersPerSecond, "speed");
  positive(input.callerVerifiedEscapeSpeedMetersPerSecond, "escape");
  const r =
    input.independentlyMeasuredEjectionSpeedMetersPerSecond /
    input.callerVerifiedEscapeSpeedMetersPerSecond;
  return { statedSpeedToEscapeRatio: r, meetsIdealEscapeSpeed: r >= 1 };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredEjectionSpeedMetersPerSecond: 1000,
    callerVerifiedEscapeSpeedMetersPerSecond: 900,
  },
  output: {
    result: {
      statedSpeedToEscapeRatio: 1.1111111111111112,
      meetsIdealEscapeSpeed: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/lithopanspermia-ejection-escape-check",
  title: "Panspermia Lithopanspermia Ejection Velocity Escape Check",
  description:
    "Ideal surface ejection-speed/escape-speed comparison, not atmospheric/gravity-loss model, trajectory feasibility, organism survival or proof panspermia occurred.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
