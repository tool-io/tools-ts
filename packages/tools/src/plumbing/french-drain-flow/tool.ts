import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly callerMeasuredPorousMediumConductivityMetersPerSecond: number;
  readonly actualEffectiveFlowAreaSquareMeters: number;
  readonly actualHydraulicGradient: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerMeasuredPorousMediumConductivityMetersPerSecond",
    label: "Caller measured porous medium conductivity meters per second",
    kind: "number",
  },
  {
    id: "actualEffectiveFlowAreaSquareMeters",
    label: "Actual effective flow area square meters",
    kind: "number",
  },
  {
    id: "actualHydraulicGradient",
    label: "Actual hydraulic gradient",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(
    input.callerMeasuredPorousMediumConductivityMetersPerSecond,
    "callerMeasuredPorousMediumConductivityMetersPerSecond",
  );
  nonnegative(
    input.actualEffectiveFlowAreaSquareMeters,
    "actualEffectiveFlowAreaSquareMeters",
  );
  return {
    value:
      input.callerMeasuredPorousMediumConductivityMetersPerSecond *
      input.actualEffectiveFlowAreaSquareMeters *
      input.actualHydraulicGradient,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerMeasuredPorousMediumConductivityMetersPerSecond: 2,
    actualEffectiveFlowAreaSquareMeters: 5,
    actualHydraulicGradient: 1,
  },
  output: { result: { value: 10 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/french-drain-flow",
  title: "Plumbing French Drain Flow Calculator",
  description:
    "DarcyFrenchdrain actual porous flow KA iunderindependently matched saturated laminar branch, no slot pipe conveyance or guaranteeunsaturateddrainage. Actual independently matched units, regime, material/equipment and governing references; not a hydraulic code, safe pressure, water pot ability or operational approval.",
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
