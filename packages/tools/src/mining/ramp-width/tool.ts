import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  count,
} from "../shared.js";
export type Input = Readonly<{
  readonly vehicleWidthM: number;
  readonly laneCount: number;
  readonly outerClearanceM: number;
  readonly innerClearanceM: number;
  readonly interLaneClearanceM: number;
  readonly drainWidthM: number;
  readonly barrierFootprintM: number;
}>;
export type Output = Readonly<{
  readonly trafficWidthM: number;
  readonly totalRampWidthM: number;
}>;
const inputFields = [
  { id: "vehicleWidthM", label: "Vehicle width m", kind: "number" },
  { id: "laneCount", label: "Lane count", kind: "integer" },
  { id: "outerClearanceM", label: "Outer clearance m", kind: "number" },
  { id: "innerClearanceM", label: "Inner clearance m", kind: "number" },
  {
    id: "interLaneClearanceM",
    label: "Inter lane clearance m",
    kind: "number",
  },
  { id: "drainWidthM", label: "Drain width m", kind: "number" },
  { id: "barrierFootprintM", label: "Barrier footprint m", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.vehicleWidthM, "vehicleWidthM");
  positive(input.laneCount, "laneCount");
  nonnegative(input.outerClearanceM, "outerClearanceM");
  nonnegative(input.innerClearanceM, "innerClearanceM");
  nonnegative(input.interLaneClearanceM, "interLaneClearanceM");
  nonnegative(input.drainWidthM, "drainWidthM");
  nonnegative(input.barrierFootprintM, "barrierFootprintM");
  count(input.laneCount, "laneCount");
  const trafficWidthM =
    input.laneCount * input.vehicleWidthM +
    input.outerClearanceM +
    input.innerClearanceM +
    (input.laneCount - 1) * input.interLaneClearanceM;
  return {
    trafficWidthM,
    totalRampWidthM:
      trafficWidthM + input.drainWidthM + input.barrierFootprintM,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  vehicleWidthM: 4,
  laneCount: 2,
  outerClearanceM: 2,
  innerClearanceM: 1,
  interLaneClearanceM: 1.5,
  drainWidthM: 0.5,
  barrierFootprintM: 1,
} satisfies Input;
export const exampleOutput = {
  trafficWidthM: 12.5,
  totalRampWidthM: 14,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/ramp-width",
  title: "Ramp Width",
  description:
    "Sum caller vehicle/lane/clearance/drain/barrier allocations; does not replace site-specific passing-sight and road design.",
  inputs: inputFields,
  outputs: [
    { id: "trafficWidthM", label: "Traffic width m", kind: "number" },
    { id: "totalRampWidthM", label: "Total ramp width m", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      vehicleWidthM: value.vehicleWidthM as number,
      laneCount: value.laneCount as number,
      outerClearanceM: value.outerClearanceM as number,
      innerClearanceM: value.innerClearanceM as number,
      interLaneClearanceM: value.interLaneClearanceM as number,
      drainWidthM: value.drainWidthM as number,
      barrierFootprintM: value.barrierFootprintM as number,
    }),
});
export const run = tool.execute;
export default tool;
