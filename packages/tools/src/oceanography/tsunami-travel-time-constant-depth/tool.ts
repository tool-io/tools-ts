import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly segmentLengthsM: readonly number[];
  readonly segmentConstantDepthsM: readonly number[];
  readonly gravityMPerSecondSquared: number;
}>;
export type Output = Readonly<{
  readonly segmentTravelTimesSeconds: readonly number[];
  readonly totalTravelTimeSeconds: number;
}>;
const inputFields = [
  { id: "segmentLengthsM", label: "Segment lengths m", kind: "numberList" },
  {
    id: "segmentConstantDepthsM",
    label: "Segment constant depths m",
    kind: "numberList",
  },
  {
    id: "gravityMPerSecondSquared",
    label: "Gravity m per second squared",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.segmentConstantDepthsM.forEach((v) =>
    positive(v, "segmentConstantDepthsM"),
  );
  positive(input.gravityMPerSecondSquared, "gravityMPerSecondSquared");
  input.segmentLengthsM.forEach((v) => nonnegative(v, "segmentLengthsM"));
  aligned(
    input.segmentLengthsM,
    input.segmentConstantDepthsM,
    "segmentLengthsM",
  );
  const segmentTravelTimesSeconds = input.segmentLengthsM.map(
    (l, i) =>
      l /
      Math.sqrt(
        input.gravityMPerSecondSquared * input.segmentConstantDepthsM[i],
      ),
  );
  return {
    segmentTravelTimesSeconds,
    totalTravelTimeSeconds: segmentTravelTimesSeconds.reduce(
      (a, b) => a + b,
      0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  segmentLengthsM: [100, 200],
  segmentConstantDepthsM: [10, 40],
  gravityMPerSecondSquared: 10,
} satisfies Input;
export const exampleOutput = {
  segmentTravelTimesSeconds: [10, 10],
  totalTravelTimeSeconds: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/tsunami-travel-time-constant-depth",
  title: "Tsunami Travel Time Constant Depth",
  description:
    "Sum long-wave travel time over supplied constant-depth path segments; distances are explicit, no geodesic route construction, dispersion or arrival-warning guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "segmentTravelTimesSeconds",
      label: "Segment travel times seconds",
      kind: "numberList",
    },
    {
      id: "totalTravelTimeSeconds",
      label: "Total travel time seconds",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      segmentLengthsM: value.segmentLengthsM as readonly number[],
      segmentConstantDepthsM: value.segmentConstantDepthsM as readonly number[],
      gravityMPerSecondSquared: value.gravityMPerSecondSquared as number,
    }),
});
export const run = tool.execute;
export default tool;
