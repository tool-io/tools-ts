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
  bounded,
  aligned,
  strictlyIncreasing,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly coreDepthsCm: readonly number[];
  readonly measuredCs137Activities: readonly number[];
  readonly callerAssignedMarkerYear: number;
}>;
export type Output = Readonly<{
  readonly uniqueObservedPeakDepthCm: number;
  readonly callerAssignedPeakYear: number;
}>;
const inputFields = [
  { id: "coreDepthsCm", label: "Core depths cm", kind: "numberList" },
  {
    id: "measuredCs137Activities",
    label: "Measured cs137 activities",
    kind: "numberList",
  },
  {
    id: "callerAssignedMarkerYear",
    label: "Caller assigned marker year",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.coreDepthsCm.forEach((v) => nonnegative(v, "coreDepthsCm"));
  input.measuredCs137Activities.forEach((v) =>
    nonnegative(v, "measuredCs137Activities"),
  );
  aligned(input.coreDepthsCm, input.measuredCs137Activities, "coreDepthsCm");
  strictlyIncreasing(input.coreDepthsCm, "depth");
  bounded(input.callerAssignedMarkerYear, "year", 1900, 2199);
  const max = positive(Math.max(...input.measuredCs137Activities), "peak"),
    indices = input.measuredCs137Activities.flatMap((v, i) =>
      v === max ? [i] : [],
    );
  if (indices.length !== 1)
    simpleError(
      "peak",
      "Unique resolved measured Cs137 peak required, ties/absent peaks ambiguous.",
    );
  return {
    uniqueObservedPeakDepthCm: input.coreDepthsCm[indices[0]],
    callerAssignedPeakYear: input.callerAssignedMarkerYear,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  coreDepthsCm: [0, 1, 2],
  measuredCs137Activities: [1, 5, 2],
  callerAssignedMarkerYear: 1963,
} satisfies Input;
export const exampleOutput = {
  uniqueObservedPeakDepthCm: 1,
  callerAssignedPeakYear: 1963,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/cesium-137-peak-year-marker",
  title: "Cesium 137 Peak Year Marker Lookup",
  description:
    "Locate actual unique core Cs137 activity maximum and annotate explicit externally justified marker year; not universally assigning 1963/1986, hemispheric fallout timing or asserting unmixed sediment chronology.",
  inputs: inputFields,
  outputs: [
    {
      id: "uniqueObservedPeakDepthCm",
      label: "Unique observed peak depth cm",
      kind: "number",
    },
    {
      id: "callerAssignedPeakYear",
      label: "Caller assigned peak year",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      coreDepthsCm: value.coreDepthsCm as readonly number[],
      measuredCs137Activities:
        value.measuredCs137Activities as readonly number[],
      callerAssignedMarkerYear: value.callerAssignedMarkerYear as number,
    }),
});
export const run = tool.execute;
export default tool;
