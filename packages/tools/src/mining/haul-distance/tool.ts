import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly segmentHorizontalRunsM: readonly number[];
  readonly segmentRisesM: readonly number[];
  readonly loadedDirectionSigns: readonly number[];
}>;
export type Output = Readonly<{
  readonly segmentSlopeDistancesM: readonly number[];
  readonly oneWayDistanceM: number;
  readonly totalSignedElevationChangeM: number;
}>;
const inputFields = [
  {
    id: "segmentHorizontalRunsM",
    label: "Segment horizontal runs m",
    kind: "numberList",
  },
  { id: "segmentRisesM", label: "Segment rises m", kind: "numberList" },
  {
    id: "loadedDirectionSigns",
    label: "Loaded direction signs",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.segmentHorizontalRunsM.forEach((v) =>
    positive(v, "segmentHorizontalRunsM"),
  );
  input.segmentRisesM.forEach((v) => nonnegative(v, "segmentRisesM"));
  aligned(
    input.segmentHorizontalRunsM,
    input.segmentRisesM,
    "segmentHorizontalRunsM",
  );
  aligned(
    input.segmentHorizontalRunsM,
    input.loadedDirectionSigns,
    "segmentHorizontalRunsM",
  );
  if (input.loadedDirectionSigns.some((v) => v !== 1 && v !== -1))
    simpleError("loadedDirectionSigns", "Signs +1 or −1 required.");
  const segmentSlopeDistancesM = input.segmentHorizontalRunsM.map((v, i) =>
    Math.hypot(v, input.segmentRisesM[i]),
  );
  return {
    segmentSlopeDistancesM,
    oneWayDistanceM: segmentSlopeDistancesM.reduce((a, b) => a + b, 0),
    totalSignedElevationChangeM: input.segmentRisesM.reduce(
      (s, v, i) => s + v * input.loadedDirectionSigns[i],
      0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  segmentHorizontalRunsM: [300, 400],
  segmentRisesM: [0, 300],
  loadedDirectionSigns: [1, -1],
} satisfies Input;
export const exampleOutput = {
  segmentSlopeDistancesM: [300, 500],
  oneWayDistanceM: 800,
  totalSignedElevationChangeM: -300,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/haul-distance",
  title: "Haul Distance",
  description:
    "Aggregate segmented haul-route lengths from horizontal runs and rise magnitudes with loaded-travel signs; not straight-line map distance or routing.",
  inputs: inputFields,
  outputs: [
    {
      id: "segmentSlopeDistancesM",
      label: "Segment slope distances m",
      kind: "numberList",
    },
    { id: "oneWayDistanceM", label: "One way distance m", kind: "number" },
    {
      id: "totalSignedElevationChangeM",
      label: "Total signed elevation change m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      segmentHorizontalRunsM: value.segmentHorizontalRunsM as readonly number[],
      segmentRisesM: value.segmentRisesM as readonly number[],
      loadedDirectionSigns: value.loadedDirectionSigns as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
