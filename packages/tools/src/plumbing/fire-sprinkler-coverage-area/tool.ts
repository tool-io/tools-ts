import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  sum,
  matrixFlags,
  aligned,
  nonnegative,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerIndependentlyMappedSprinklerCellFlags: readonly (readonly number[])[];
  readonly observedCellAreasM2: readonly number[];
  readonly observedDeliveredCellLitersMinute: readonly number[];
  readonly callerRequiredDeliveredDensityLitersMinuteM2: number;
}>;
export type Output = Readonly<{
  readonly observedMappedCoverageAreaM2: number;
  readonly unmappedCellAreaM2: number;
  readonly multiplyMappedAreaM2: number;
  readonly observedDeliveredDensitiesLitersMinuteM2: readonly number[];
  readonly mappedAreaMeetingCallerDeliveredDensityM2: number;
}>;
const inputFields = [
  {
    id: "callerIndependentlyMappedSprinklerCellFlags",
    label: "Caller independently mapped sprinkler cell flags",
    kind: "matrix",
  },
  {
    id: "observedCellAreasM2",
    label: "Observed cell areas m2",
    kind: "numberList",
  },
  {
    id: "observedDeliveredCellLitersMinute",
    label: "Observed delivered cell liters minute",
    kind: "numberList",
  },
  {
    id: "callerRequiredDeliveredDensityLitersMinuteM2",
    label: "Caller required delivered density liters minute m2",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedCellAreasM2.forEach((v) => positive(v, "observedCellAreasM2"));
  aligned(
    input.observedCellAreasM2,
    input.observedDeliveredCellLitersMinute,
    "delivered flow",
  );
  input.observedDeliveredCellLitersMinute.forEach((v) =>
    nonnegative(v, "observed delivered flow"),
  );
  nonnegative(
    input.callerRequiredDeliveredDensityLitersMinuteM2,
    "caller density",
  );
  matrixFlags(
    input.callerIndependentlyMappedSprinklerCellFlags,
    input.observedCellAreasM2.length,
  );
  const counts = input.observedCellAreasM2.map((_, j) =>
    sum(input.callerIndependentlyMappedSprinklerCellFlags.map((r) => r[j])),
  );
  const densities = input.observedDeliveredCellLitersMinute.map(
    (v, i) => v / input.observedCellAreasM2[i],
  );
  return {
    observedDeliveredDensitiesLitersMinuteM2: densities,
    mappedAreaMeetingCallerDeliveredDensityM2: sum(
      input.observedCellAreasM2.filter(
        (_, i) =>
          counts[i] > 0 &&
          densities[i] >= input.callerRequiredDeliveredDensityLitersMinuteM2,
      ),
    ),
    observedMappedCoverageAreaM2: sum(
      input.observedCellAreasM2.filter((_, j) => counts[j] > 0),
    ),
    unmappedCellAreaM2: sum(
      input.observedCellAreasM2.filter((_, j) => counts[j] === 0),
    ),
    multiplyMappedAreaM2: sum(
      input.observedCellAreasM2.filter((_, j) => counts[j] > 1),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerIndependentlyMappedSprinklerCellFlags: [
    [1, 1, 0],
    [0, 1, 0],
  ],
  observedCellAreasM2: [1, 2, 3],
  observedDeliveredCellLitersMinute: [0.5, 4, 0],
  callerRequiredDeliveredDensityLitersMinuteM2: 1,
} satisfies Input;
export const exampleOutput = {
  observedMappedCoverageAreaM2: 3,
  unmappedCellAreaM2: 3,
  multiplyMappedAreaM2: 2,
  observedDeliveredDensitiesLitersMinuteM2: [0.5, 2, 0],
  mappedAreaMeetingCallerDeliveredDensityM2: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/fire-sprinkler-coverage-area",
  title: "Plumbing Fire Sprinkler Coverage Area Calculator",
  description:
    "Audit caller mapped fire-sprinkler cell union/overlap plus independently measured delivered water density against explicit caller criterion; differs from geometric light-footprint union, no inferred spray pattern, fire readiness, head placement or hydraulic safety design.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedDeliveredDensitiesLitersMinuteM2",
      label: "Observed delivered densities liters minute m2",
      kind: "numberList",
    },
    {
      id: "mappedAreaMeetingCallerDeliveredDensityM2",
      label: "Mapped area meeting caller delivered density m2",
      kind: "number",
    },
    {
      id: "observedMappedCoverageAreaM2",
      label: "Observed mapped coverage area m2",
      kind: "number",
    },
    {
      id: "unmappedCellAreaM2",
      label: "Unmapped cell area m2",
      kind: "number",
    },
    {
      id: "multiplyMappedAreaM2",
      label: "Multiply mapped area m2",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerIndependentlyMappedSprinklerCellFlags:
        value.callerIndependentlyMappedSprinklerCellFlags as readonly (readonly number[])[],
      observedCellAreasM2: value.observedCellAreasM2 as readonly number[],
      observedDeliveredCellLitersMinute:
        value.observedDeliveredCellLitersMinute as readonly number[],
      callerRequiredDeliveredDensityLitersMinuteM2:
        value.callerRequiredDeliveredDensityLitersMinuteM2 as number,
    }),
});
export const run = tool.execute;
export default tool;
