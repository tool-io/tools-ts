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
  readonly actualInnerDiameterMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualVolumeFlowCubicMetersPerSecond",
    label: "Actual volume flow cubic meters per second",
    kind: "number",
  },
  {
    id: "actualInnerDiameterMeters",
    label: "Actual inner diameter meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualVolumeFlowCubicMetersPerSecond,
    "actualVolumeFlowCubicMetersPerSecond",
  );
  positive(input.actualInnerDiameterMeters, "actualInnerDiameterMeters");
  return {
    value:
      (4 * input.actualVolumeFlowCubicMetersPerSecond) /
      (Math.PI * input.actualInnerDiameterMeters ** 2),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualVolumeFlowCubicMetersPerSecond: 3.141592653589793,
    actualInnerDiameterMeters: 2,
  },
  output: { result: { value: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/pipe-velocity-from-flow",
  title: "Plumbing Pipe Velocity From Flow Calculator",
  description:
    "Inverse full circular pipe mean velocity4Q/(\u03c0d\u00b2), not Darcy flux over porous area. Actual independently matched units, regime, material/equipment and governing references; not a hydraulic code, safe pressure, water pot ability or operational approval.",
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
