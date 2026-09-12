import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualPipeLengthMeters: number;
  readonly actualVolumeFlowCubicMetersPerSecond: number;
  readonly callerMatchedHazenWilliamsC: number;
  readonly actualInnerDiameterMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualPipeLengthMeters",
    label: "Actual pipe length meters",
    kind: "number",
  },
  {
    id: "actualVolumeFlowCubicMetersPerSecond",
    label: "Actual volume flow cubic meters per second",
    kind: "number",
  },
  {
    id: "callerMatchedHazenWilliamsC",
    label: "Caller matched hazen williams c",
    kind: "number",
  },
  {
    id: "actualInnerDiameterMeters",
    label: "Actual inner diameter meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualPipeLengthMeters, "actualPipeLengthMeters");
  nonnegative(
    input.actualVolumeFlowCubicMetersPerSecond,
    "actualVolumeFlowCubicMetersPerSecond",
  );
  positive(input.callerMatchedHazenWilliamsC, "callerMatchedHazenWilliamsC");
  positive(input.actualInnerDiameterMeters, "actualInnerDiameterMeters");
  return {
    value:
      (10.67 *
        input.actualPipeLengthMeters *
        input.actualVolumeFlowCubicMetersPerSecond ** 1.852) /
      (input.callerMatchedHazenWilliamsC ** 1.852 *
        input.actualInnerDiameterMeters ** 4.8704),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualPipeLengthMeters: 1,
    actualVolumeFlowCubicMetersPerSecond: 1,
    callerMatchedHazenWilliamsC: 1,
    actualInnerDiameterMeters: 1,
  },
  output: { result: { value: 10.67 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/hazen-williams-head-loss",
  title: "Plumbing Hazen Williams Head Loss Calculator",
  description:
    "Metric empiricalHazen\u2013Williams head loss10.67LQ^1.852/(C^1.852d^4.8704), water regime/coefficients independently verified; no Darcy friction factor or minor loss. Actual independently matched units, regime, material/equipment and governing references; not a hydraulic code, safe pressure, water pot ability or operational approval.",
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
