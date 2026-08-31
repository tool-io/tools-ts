import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  binary,
  catalogIndex,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly callerCropStageIds: readonly string[];
  readonly callerSourceEcMaximumMsCm: readonly number[];
  readonly queryCropStageId: string;
  readonly observedSourceEcMsCm: readonly number[];
  readonly measurementEvidenceFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly sourceSamplesAboveCallerEcIndices: readonly number[];
  readonly sourceSamplesWithoutEcEvidence: readonly number[];
  readonly callerSourceEcMaximumMsCm: number;
}>;
const inputFields = [
  {
    id: "callerCropStageIds",
    label: "Caller crop stage ids",
    kind: "stringList",
  },
  {
    id: "callerSourceEcMaximumMsCm",
    label: "Caller source ec maximum ms cm",
    kind: "numberList",
  },
  { id: "queryCropStageId", label: "Query crop stage id", kind: "string" },
  {
    id: "observedSourceEcMsCm",
    label: "Observed source ec ms cm",
    kind: "numberList",
  },
  {
    id: "measurementEvidenceFlags",
    label: "Measurement evidence flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerSourceEcMaximumMsCm.forEach((v) =>
    nonnegative(v, "callerSourceEcMaximumMsCm"),
  );
  input.observedSourceEcMsCm.forEach((v) =>
    nonnegative(v, "observedSourceEcMsCm"),
  );
  binary(input.measurementEvidenceFlags, "measurementEvidenceFlags");
  aligned(
    input.callerCropStageIds,
    input.callerSourceEcMaximumMsCm,
    "callerCropStageIds",
  );
  aligned(
    input.observedSourceEcMsCm,
    input.measurementEvidenceFlags,
    "observedSourceEcMsCm",
  );
  const i = catalogIndex(input.callerCropStageIds, input.queryCropStageId),
    limit = input.callerSourceEcMaximumMsCm[i];
  return {
    sourceSamplesAboveCallerEcIndices: input.observedSourceEcMsCm.flatMap(
      (v, j) => (input.measurementEvidenceFlags[j] && v > limit ? [j] : []),
    ),
    sourceSamplesWithoutEcEvidence: input.measurementEvidenceFlags.flatMap(
      (v, j) => (v ? [] : [j]),
    ),
    callerSourceEcMaximumMsCm: limit,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerCropStageIds: ["a", "b"],
  callerSourceEcMaximumMsCm: [0.5, 1],
  queryCropStageId: "a",
  observedSourceEcMsCm: [0.4, 0.8],
  measurementEvidenceFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  sourceSamplesAboveCallerEcIndices: [],
  sourceSamplesWithoutEcEvidence: [1],
  callerSourceEcMaximumMsCm: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/source-water-ec-threshold-lookup",
  title: "Source Water EC Threshold Lookup",
  description:
    "Audit actual source-water EC evidence against independently supplied crop-stage maximum, preserving unknowns; no salinity-ion inference, temperature correction or universal crop threshold.",
  inputs: inputFields,
  outputs: [
    {
      id: "sourceSamplesAboveCallerEcIndices",
      label: "Source samples above caller ec indices",
      kind: "numberList",
    },
    {
      id: "sourceSamplesWithoutEcEvidence",
      label: "Source samples without ec evidence",
      kind: "numberList",
    },
    {
      id: "callerSourceEcMaximumMsCm",
      label: "Caller source ec maximum ms cm",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerCropStageIds: value.callerCropStageIds as readonly string[],
      callerSourceEcMaximumMsCm:
        value.callerSourceEcMaximumMsCm as readonly number[],
      queryCropStageId: value.queryCropStageId as string,
      observedSourceEcMsCm: value.observedSourceEcMsCm as readonly number[],
      measurementEvidenceFlags:
        value.measurementEvidenceFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
