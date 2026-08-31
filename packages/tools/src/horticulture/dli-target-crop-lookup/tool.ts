import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  catalogIndex,
  band,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly callerCropStageIds: readonly string[];
  readonly callerMinimumDli: readonly number[];
  readonly callerMaximumDli: readonly number[];
  readonly queryCropStageId: string;
  readonly measuredDli: number;
}>;
export type Output = Readonly<{
  readonly callerDliTargetRange: readonly number[];
  readonly signedObservedDliBandMargin: number;
  readonly withinCallerCropStageBand: boolean;
}>;
const inputFields = [
  {
    id: "callerCropStageIds",
    label: "Caller crop stage ids",
    kind: "stringList",
  },
  { id: "callerMinimumDli", label: "Caller minimum dli", kind: "numberList" },
  { id: "callerMaximumDli", label: "Caller maximum dli", kind: "numberList" },
  { id: "queryCropStageId", label: "Query crop stage id", kind: "string" },
  { id: "measuredDli", label: "Measured dli", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerMinimumDli.forEach((v) => nonnegative(v, "callerMinimumDli"));
  input.callerMaximumDli.forEach((v) => nonnegative(v, "callerMaximumDli"));
  nonnegative(input.measuredDli, "measuredDli");
  aligned(
    input.callerCropStageIds,
    input.callerMinimumDli,
    "callerCropStageIds",
  );
  aligned(
    input.callerCropStageIds,
    input.callerMaximumDli,
    "callerCropStageIds",
  );
  const i = catalogIndex(input.callerCropStageIds, input.queryCropStageId),
    margin = band(
      input.measuredDli,
      input.callerMinimumDli[i],
      input.callerMaximumDli[i],
    );
  return {
    callerDliTargetRange: [
      input.callerMinimumDli[i],
      input.callerMaximumDli[i],
    ],
    signedObservedDliBandMargin: margin,
    withinCallerCropStageBand: margin >= 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerCropStageIds: ["a", "b"],
  callerMinimumDli: [10, 15],
  callerMaximumDli: [20, 25],
  queryCropStageId: "a",
  measuredDli: 12,
} satisfies Input;
export const exampleOutput = {
  callerDliTargetRange: [10, 20],
  signedObservedDliBandMargin: 2,
  withinCallerCropStageBand: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/dli-target-crop-lookup",
  title: "DLI Target Crop Lookup",
  description:
    "Audit measured photon dose against exact caller crop-stage DLI policy; no fabricated universal crop targets, light integration or growth/yield guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerDliTargetRange",
      label: "Caller dli target range",
      kind: "numberList",
    },
    {
      id: "signedObservedDliBandMargin",
      label: "Signed observed dli band margin",
      kind: "number",
    },
    {
      id: "withinCallerCropStageBand",
      label: "Within caller crop stage band",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      callerCropStageIds: value.callerCropStageIds as readonly string[],
      callerMinimumDli: value.callerMinimumDli as readonly number[],
      callerMaximumDli: value.callerMaximumDli as readonly number[],
      queryCropStageId: value.queryCropStageId as string,
      measuredDli: value.measuredDli as number,
    }),
});
export const run = tool.execute;
export default tool;
