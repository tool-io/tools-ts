import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualVolumeFlowCubicMetersPerSecond: number;
  readonly callerIndependentlySpecifiedMeanVelocityMetersPerSecond: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualVolumeFlowCubicMetersPerSecond",
    label: "Actual volume flow cubic meters per second",
    kind: "number",
  },
  {
    id: "callerIndependentlySpecifiedMeanVelocityMetersPerSecond",
    label: "Caller independently specified mean velocity meters per second",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualVolumeFlowCubicMetersPerSecond,
    "actualVolumeFlowCubicMetersPerSecond",
  );
  positive(
    input.callerIndependentlySpecifiedMeanVelocityMetersPerSecond,
    "callerIndependentlySpecifiedMeanVelocityMetersPerSecond",
  );
  return {
    value: Math.sqrt(
      (4 * input.actualVolumeFlowCubicMetersPerSecond) /
        (Math.PI *
          input.callerIndependentlySpecifiedMeanVelocityMetersPerSecond),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualVolumeFlowCubicMetersPerSecond: 3.141592653589793,
    callerIndependentlySpecifiedMeanVelocityMetersPerSecond: 1,
  },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/pipe-diameter-from-flow-velocity",
  title: "Plumbing Pipe Diameter From Flow Velocity Calculator",
  description:
    "Ideal internal circular hydraulic diameter from actual Qand externally specifiedv, not choose nominal pipe or code velocity. Actual independently matched units, regime, material/equipment and governing references; not a hydraulic code, safe pressure, water pot ability or operational approval.",
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
