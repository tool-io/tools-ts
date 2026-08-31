import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  catalogIndex,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly callerProductIds: readonly string[];
  readonly callerMatchedSubstrateTemperaturesC: readonly number[];
  readonly callerMeasuredReleaseDurationDays: readonly number[];
  readonly queryProductId: string;
  readonly observedElapsedDays: number;
  readonly observedMatchedSubstrateTemperatureC: number;
}>;
export type Output = Readonly<{
  readonly callerMatchedRatedDurationDays: number;
  readonly signedRemainingRatedDays: number;
  readonly temperatureConditionMatchesCallerRecord: boolean;
}>;
const inputFields = [
  { id: "callerProductIds", label: "Caller product ids", kind: "stringList" },
  {
    id: "callerMatchedSubstrateTemperaturesC",
    label: "Caller matched substrate temperatures c",
    kind: "numberList",
  },
  {
    id: "callerMeasuredReleaseDurationDays",
    label: "Caller measured release duration days",
    kind: "numberList",
  },
  { id: "queryProductId", label: "Query product id", kind: "string" },
  { id: "observedElapsedDays", label: "Observed elapsed days", kind: "number" },
  {
    id: "observedMatchedSubstrateTemperatureC",
    label: "Observed matched substrate temperature c",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerMeasuredReleaseDurationDays.forEach((v) =>
    positive(v, "callerMeasuredReleaseDurationDays"),
  );
  nonnegative(input.observedElapsedDays, "observedElapsedDays");
  aligned(
    input.callerProductIds,
    input.callerMatchedSubstrateTemperaturesC,
    "callerProductIds",
  );
  aligned(
    input.callerProductIds,
    input.callerMeasuredReleaseDurationDays,
    "callerProductIds",
  );
  const i = catalogIndex(input.callerProductIds, input.queryProductId);
  return {
    callerMatchedRatedDurationDays: input.callerMeasuredReleaseDurationDays[i],
    signedRemainingRatedDays:
      input.callerMeasuredReleaseDurationDays[i] - input.observedElapsedDays,
    temperatureConditionMatchesCallerRecord:
      input.observedMatchedSubstrateTemperatureC ===
      input.callerMatchedSubstrateTemperaturesC[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerProductIds: ["a", "b"],
  callerMatchedSubstrateTemperaturesC: [20, 25],
  callerMeasuredReleaseDurationDays: [120, 80],
  queryProductId: "a",
  observedElapsedDays: 60,
  observedMatchedSubstrateTemperatureC: 20,
} satisfies Input;
export const exampleOutput = {
  callerMatchedRatedDurationDays: 120,
  signedRemainingRatedDays: 60,
  temperatureConditionMatchesCallerRecord: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/slow-release-months-rating-lookup",
  title: "Slow Release Months Rating Lookup",
  description:
    "Audit actual slow-release product duration record and exact temperature-condition match, retaining elapsed-over-rating deficits; no universal months, temperature scaling, remaining nutrient assay or fertilizer efficacy.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerMatchedRatedDurationDays",
      label: "Caller matched rated duration days",
      kind: "number",
    },
    {
      id: "signedRemainingRatedDays",
      label: "Signed remaining rated days",
      kind: "number",
    },
    {
      id: "temperatureConditionMatchesCallerRecord",
      label: "Temperature condition matches caller record",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      callerProductIds: value.callerProductIds as readonly string[],
      callerMatchedSubstrateTemperaturesC:
        value.callerMatchedSubstrateTemperaturesC as readonly number[],
      callerMeasuredReleaseDurationDays:
        value.callerMeasuredReleaseDurationDays as readonly number[],
      queryProductId: value.queryProductId as string,
      observedElapsedDays: value.observedElapsedDays as number,
      observedMatchedSubstrateTemperatureC:
        value.observedMatchedSubstrateTemperatureC as number,
    }),
});
export const run = tool.execute;
export default tool;
