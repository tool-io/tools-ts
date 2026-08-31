import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  sum,
  catalogIndex,
  band,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly callerCropStageIds: readonly string[];
  readonly callerGerminationTemperatureMinimumC: readonly number[];
  readonly callerGerminationTemperatureMaximumC: readonly number[];
  readonly queryCropStageId: string;
  readonly observedRootZoneTemperatureC: readonly number[];
  readonly observationHours: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedHoursInsideCallerBand: number;
  readonly observedHoursBelowCallerBand: number;
  readonly observedHoursAboveCallerBand: number;
}>;
const inputFields = [
  {
    id: "callerCropStageIds",
    label: "Caller crop stage ids",
    kind: "stringList",
  },
  {
    id: "callerGerminationTemperatureMinimumC",
    label: "Caller germination temperature minimum c",
    kind: "numberList",
  },
  {
    id: "callerGerminationTemperatureMaximumC",
    label: "Caller germination temperature maximum c",
    kind: "numberList",
  },
  { id: "queryCropStageId", label: "Query crop stage id", kind: "string" },
  {
    id: "observedRootZoneTemperatureC",
    label: "Observed root zone temperature c",
    kind: "numberList",
  },
  { id: "observationHours", label: "Observation hours", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observationHours.forEach((v) => positive(v, "observationHours"));
  aligned(
    input.callerCropStageIds,
    input.callerGerminationTemperatureMinimumC,
    "callerCropStageIds",
  );
  aligned(
    input.callerCropStageIds,
    input.callerGerminationTemperatureMaximumC,
    "callerCropStageIds",
  );
  aligned(
    input.observedRootZoneTemperatureC,
    input.observationHours,
    "observedRootZoneTemperatureC",
  );
  const i = catalogIndex(input.callerCropStageIds, input.queryCropStageId),
    lo = input.callerGerminationTemperatureMinimumC[i],
    hi = input.callerGerminationTemperatureMaximumC[i];
  band(0, lo, hi);
  return {
    observedHoursInsideCallerBand: sum(
      input.observationHours.filter(
        (_, j) => band(input.observedRootZoneTemperatureC[j], lo, hi) >= 0,
      ),
    ),
    observedHoursBelowCallerBand: sum(
      input.observationHours.filter(
        (_, j) => input.observedRootZoneTemperatureC[j] < lo,
      ),
    ),
    observedHoursAboveCallerBand: sum(
      input.observationHours.filter(
        (_, j) => input.observedRootZoneTemperatureC[j] > hi,
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerCropStageIds: ["a", "b"],
  callerGerminationTemperatureMinimumC: [20, 15],
  callerGerminationTemperatureMaximumC: [25, 20],
  queryCropStageId: "a",
  observedRootZoneTemperatureC: [19, 22, 26],
  observationHours: [1, 2, 1],
} satisfies Input;
export const exampleOutput = {
  observedHoursInsideCallerBand: 2,
  observedHoursBelowCallerBand: 1,
  observedHoursAboveCallerBand: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/germination-mat-temp-range-lookup",
  title: "Germination Mat Temp Range Lookup",
  description:
    "Audit actual measured root-zone time exposure against exact caller germination stage temperature band; sample values represent provided duration, no heat-mat thermostat instruction or universal cultivar ranges.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedHoursInsideCallerBand",
      label: "Observed hours inside caller band",
      kind: "number",
    },
    {
      id: "observedHoursBelowCallerBand",
      label: "Observed hours below caller band",
      kind: "number",
    },
    {
      id: "observedHoursAboveCallerBand",
      label: "Observed hours above caller band",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerCropStageIds: value.callerCropStageIds as readonly string[],
      callerGerminationTemperatureMinimumC:
        value.callerGerminationTemperatureMinimumC as readonly number[],
      callerGerminationTemperatureMaximumC:
        value.callerGerminationTemperatureMaximumC as readonly number[],
      queryCropStageId: value.queryCropStageId as string,
      observedRootZoneTemperatureC:
        value.observedRootZoneTemperatureC as readonly number[],
      observationHours: value.observationHours as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
