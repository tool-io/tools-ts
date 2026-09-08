import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly observedLakeVolumeCubicMeters: number;
  readonly callerValidatedHydraulicConductanceCubicMetersPerSecondPerMeter: number;
  readonly observedHeadDifferenceMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedLakeVolumeCubicMeters",
    label: "Observed lake volume cubic meters",
    kind: "number",
  },
  {
    id: "callerValidatedHydraulicConductanceCubicMetersPerSecondPerMeter",
    label:
      "Caller validated hydraulic conductance cubic meters per second per meter",
    kind: "number",
  },
  {
    id: "observedHeadDifferenceMeters",
    label: "Observed head difference meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.observedLakeVolumeCubicMeters, "volume");
  positive(
    input.callerValidatedHydraulicConductanceCubicMetersPerSecondPerMeter,
    "conductance",
  );
  const q =
    input.callerValidatedHydraulicConductanceCubicMetersPerSecondPerMeter *
    input.observedHeadDifferenceMeters;
  positive(Math.abs(q), "absoluteflow");
  return {
    conditionalSignedFlowCubicMetersPerSecond: q,
    conditionalVolumeThroughputSeconds:
      input.observedLakeVolumeCubicMeters / Math.abs(q),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    observedLakeVolumeCubicMeters: 100,
    callerValidatedHydraulicConductanceCubicMetersPerSecondPerMeter: 2,
    observedHeadDifferenceMeters: -5,
  },
  output: {
    result: {
      conditionalSignedFlowCubicMetersPerSecond: -10,
      conditionalVolumeThroughputSeconds: 10,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/subglacial-residence-hydraulic-head-calculator",
  title: "Subglacial Lake Residence Time Hydraulic Head Calculator",
  description:
    "Conditional linear head-conductance signed flow and volume/absolute-flow turnover. Not a tracer residence-time distribution, actual recharge or lake mixing; conductance externally calibrated.",
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
