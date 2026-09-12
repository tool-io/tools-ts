import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualInnerDiameterMeters: number;
  readonly actualMeanVelocityMetersPerSecond: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualInnerDiameterMeters",
    label: "Actual inner diameter meters",
    kind: "number",
  },
  {
    id: "actualMeanVelocityMetersPerSecond",
    label: "Actual mean velocity meters per second",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.actualInnerDiameterMeters, "actualInnerDiameterMeters");
  nonnegative(
    input.actualMeanVelocityMetersPerSecond,
    "actualMeanVelocityMetersPerSecond",
  );
  return {
    value:
      ((Math.PI * input.actualInnerDiameterMeters ** 2) / 4) *
      input.actualMeanVelocityMetersPerSecond,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualInnerDiameterMeters: 2, actualMeanVelocityMetersPerSecond: 2 },
  output: { result: { value: 6.283185307179586 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/pipe-flow-rate",
  title: "Plumbing Pipe Flow Rate Calculator",
  description:
    "Actual full circular pipe mean velocity\u00d7\u03c0d\u00b2/4volume flowm\u00b3/s, not pressure-driven flow model. Actual independently matched units, regime, material/equipment and governing references; not a hydraulic code, safe pressure, water pot ability or operational approval.",
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
