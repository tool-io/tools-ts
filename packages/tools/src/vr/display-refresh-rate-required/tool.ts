import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualMaximumAngularSpeedDegreesPerSecond: number;
  readonly callerMaximumAngularMovementPerRefreshDegrees: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualMaximumAngularSpeedDegreesPerSecond",
    label: "Actual maximum angular speed degrees per second",
    kind: "number",
  },
  {
    id: "callerMaximumAngularMovementPerRefreshDegrees",
    label: "Caller maximum angular movement per refresh degrees",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualMaximumAngularSpeedDegreesPerSecond,
    "actualMaximumAngularSpeedDegreesPerSecond",
  );
  positive(
    input.callerMaximumAngularMovementPerRefreshDegrees,
    "callerMaximumAngularMovementPerRefreshDegrees",
  );
  return {
    value:
      input.actualMaximumAngularSpeedDegreesPerSecond /
      input.callerMaximumAngularMovementPerRefreshDegrees,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualMaximumAngularSpeedDegreesPerSecond: 50,
    callerMaximumAngularMovementPerRefreshDegrees: 0.5,
  },
  output: { result: { value: 100 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vr/display-refresh-rate-required",
  title: "Display Refresh Rate Required Calculator",
  description:
    "Conditional refresh frequency\u03c9/angular step constraint, independent quality budget not viewer-specific comfort threshold or recommend safeHz.",
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
