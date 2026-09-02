import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  integer,
  aligned,
  sum,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedUncappedFrameCounts: readonly number[];
  readonly observedActiveMinutes: readonly number[];
  readonly observedSetupMinutes: readonly number[];
}>;
export type Output = Readonly<{
  readonly activeUncappingFramesPerHour: number;
  readonly clockUncappingFramesPerHour: number;
}>;
const inputFields = [
  {
    id: "observedUncappedFrameCounts",
    label: "Observed uncapped frame counts",
    kind: "numberList",
  },
  {
    id: "observedActiveMinutes",
    label: "Observed active minutes",
    kind: "numberList",
  },
  {
    id: "observedSetupMinutes",
    label: "Observed setup minutes",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedActiveMinutes.forEach((v) =>
    positive(v, "observedActiveMinutes"),
  );
  input.observedUncappedFrameCounts.forEach((v) =>
    nonnegative(v, "observedUncappedFrameCounts"),
  );
  input.observedSetupMinutes.forEach((v) =>
    nonnegative(v, "observedSetupMinutes"),
  );
  aligned(
    input.observedUncappedFrameCounts,
    input.observedActiveMinutes,
    "observedUncappedFrameCounts",
  );
  aligned(
    input.observedUncappedFrameCounts,
    input.observedSetupMinutes,
    "observedUncappedFrameCounts",
  );
  input.observedUncappedFrameCounts.forEach((v) => integer(v, "frames"));
  const f = sum(input.observedUncappedFrameCounts),
    a = sum(input.observedActiveMinutes);
  return {
    activeUncappingFramesPerHour: (60 * f) / a,
    clockUncappingFramesPerHour:
      (60 * f) / (a + sum(input.observedSetupMinutes)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedUncappedFrameCounts: [10, 20],
  observedActiveMinutes: [10, 20],
  observedSetupMinutes: [5, 5],
} satisfies Input;
export const exampleOutput = {
  activeUncappingFramesPerHour: 60,
  clockUncappingFramesPerHour: 45,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/uncapper-throughput-frames-hour",
  title: "Uncapper Throughput Frames Hour Calculator",
  description:
    "Actual uncapper active vs total-clock throughput measurements with independent setup, not serial extraction-room station/buffering model. Caller independently verifies strain, site, protocol and evidence; not colony-health, treatment, transport-safety or regulatory certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "activeUncappingFramesPerHour",
      label: "Active uncapping frames per hour",
      kind: "number",
    },
    {
      id: "clockUncappingFramesPerHour",
      label: "Clock uncapping frames per hour",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedUncappedFrameCounts:
        value.observedUncappedFrameCounts as readonly number[],
      observedActiveMinutes: value.observedActiveMinutes as readonly number[],
      observedSetupMinutes: value.observedSetupMinutes as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
