import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  binary,
  unique,
  sum,
} from "../batch44-shared.js";

export type Input = Readonly<{
  readonly callerAqueductIds: readonly string[];
  readonly independentlyEstimatedDailyVolumes: readonly number[];
  readonly dailyVolumeKnownFlags: readonly number[];
  readonly independentlySurveyedRouteLengths: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "callerAqueductIds", label: "Caller aqueduct ids", kind: "stringList" },
  {
    id: "independentlyEstimatedDailyVolumes",
    label: "Independently estimated daily volumes",
    kind: "numberList",
  },
  {
    id: "dailyVolumeKnownFlags",
    label: "Daily volume known flags",
    kind: "numberList",
  },
  {
    id: "independentlySurveyedRouteLengths",
    label: "Independently surveyed route lengths",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  unique(input.callerAqueductIds, "aqueducts");
  for (const v of [
    input.independentlyEstimatedDailyVolumes,
    input.dailyVolumeKnownFlags,
    input.independentlySurveyedRouteLengths,
  ])
    aligned(input.callerAqueductIds, v, "inventory");
  input.independentlyEstimatedDailyVolumes.forEach((v) =>
    nonnegative(v, "dailyvolume"),
  );
  input.independentlySurveyedRouteLengths.forEach((v) =>
    nonnegative(v, "routelength"),
  );
  binary(input.dailyVolumeKnownFlags, "known");
  return {
    knownDailyVolumeSum: sum(
      input.independentlyEstimatedDailyVolumes.map(
        (v, i) => v * input.dailyVolumeKnownFlags[i],
      ),
    ),
    unknownDailyVolumeIds: input.callerAqueductIds.filter(
      (_, i) => !input.dailyVolumeKnownFlags[i],
    ),
    surveyedRouteLengthSum: sum(input.independentlySurveyedRouteLengths),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerAqueductIds: ["a", "b", "c"],
    independentlyEstimatedDailyVolumes: [100, 200, 300],
    dailyVolumeKnownFlags: [1, 0, 1],
    independentlySurveyedRouteLengths: [10, 20, 30],
  },
  output: {
    result: {
      knownDailyVolumeSum: 400,
      unknownDailyVolumeIds: ["b"],
      surveyedRouteLengthSum: 60,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/eleven-aqueducts-rome-total-length-daily-flow-estimate",
  title: "Eleven Aqueducts Rome Total Length Daily Flow Estimate",
  description:
    "Aggregate actual independently enumerated aqueduct route lengths and same-unit daily volumes, retaining unknown volume IDs. Eleven is a conventional historic inventory context, not an inferred fixed count, universal flow or source-vs-delivery conversion; a partial caller inventory stays partial.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
