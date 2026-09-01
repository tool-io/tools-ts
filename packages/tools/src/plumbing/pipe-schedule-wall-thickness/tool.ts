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
  aligned,
  catalogIndex,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedPipeScheduleIds: readonly string[];
  readonly callerVerifiedOuterDiameterMm: readonly number[];
  readonly callerVerifiedWallThicknessMm: readonly number[];
  readonly queryPipeScheduleId: string;
  readonly observedMinimumWallMm: number;
}>;
export type Output = Readonly<{
  readonly callerScheduledOuterDiameterMm: number;
  readonly callerScheduledWallMm: number;
  readonly callerScheduledInnerDiameterMm: number;
  readonly signedObservedMinusScheduledWallMm: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedPipeScheduleIds",
    label: "Caller verified pipe schedule ids",
    kind: "stringList",
  },
  {
    id: "callerVerifiedOuterDiameterMm",
    label: "Caller verified outer diameter mm",
    kind: "numberList",
  },
  {
    id: "callerVerifiedWallThicknessMm",
    label: "Caller verified wall thickness mm",
    kind: "numberList",
  },
  {
    id: "queryPipeScheduleId",
    label: "Query pipe schedule id",
    kind: "string",
  },
  {
    id: "observedMinimumWallMm",
    label: "Observed minimum wall mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerVerifiedOuterDiameterMm.forEach((v) =>
    positive(v, "callerVerifiedOuterDiameterMm"),
  );
  input.callerVerifiedWallThicknessMm.forEach((v) =>
    positive(v, "callerVerifiedWallThicknessMm"),
  );
  positive(input.observedMinimumWallMm, "observedMinimumWallMm");
  aligned(
    input.callerVerifiedPipeScheduleIds,
    input.callerVerifiedOuterDiameterMm,
    "callerVerifiedPipeScheduleIds",
  );
  aligned(
    input.callerVerifiedPipeScheduleIds,
    input.callerVerifiedWallThicknessMm,
    "callerVerifiedPipeScheduleIds",
  );
  if (
    input.callerVerifiedOuterDiameterMm.some(
      (v, i) => 2 * input.callerVerifiedWallThicknessMm[i] >= v,
    )
  )
    simpleError(
      "schedule",
      "Positive internal diameter required for every verified schedule.",
    );
  const i = catalogIndex(
    input.callerVerifiedPipeScheduleIds,
    input.queryPipeScheduleId,
  );
  return {
    callerScheduledOuterDiameterMm: input.callerVerifiedOuterDiameterMm[i],
    callerScheduledWallMm: input.callerVerifiedWallThicknessMm[i],
    callerScheduledInnerDiameterMm:
      input.callerVerifiedOuterDiameterMm[i] -
      2 * input.callerVerifiedWallThicknessMm[i],
    signedObservedMinusScheduledWallMm:
      input.observedMinimumWallMm - input.callerVerifiedWallThicknessMm[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedPipeScheduleIds: ["a", "b"],
  callerVerifiedOuterDiameterMm: [20, 30],
  callerVerifiedWallThicknessMm: [2, 3],
  queryPipeScheduleId: "a",
  observedMinimumWallMm: 1.8,
} satisfies Input;
export const exampleOutput = {
  callerScheduledOuterDiameterMm: 20,
  callerScheduledWallMm: 2,
  callerScheduledInnerDiameterMm: 16,
  signedObservedMinusScheduledWallMm: -0.2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/pipe-schedule-wall-thickness",
  title: "Plumbing Pipe Schedule Wall Thickness Calculator",
  description:
    "Read actual caller verified schedule OD/wall and compare measured wall, not invented nominal schedule table or standalone ID subtraction, no pressure rating.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerScheduledOuterDiameterMm",
      label: "Caller scheduled outer diameter mm",
      kind: "number",
    },
    {
      id: "callerScheduledWallMm",
      label: "Caller scheduled wall mm",
      kind: "number",
    },
    {
      id: "callerScheduledInnerDiameterMm",
      label: "Caller scheduled inner diameter mm",
      kind: "number",
    },
    {
      id: "signedObservedMinusScheduledWallMm",
      label: "Signed observed minus scheduled wall mm",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerVerifiedPipeScheduleIds:
        value.callerVerifiedPipeScheduleIds as readonly string[],
      callerVerifiedOuterDiameterMm:
        value.callerVerifiedOuterDiameterMm as readonly number[],
      callerVerifiedWallThicknessMm:
        value.callerVerifiedWallThicknessMm as readonly number[],
      queryPipeScheduleId: value.queryPipeScheduleId as string,
      observedMinimumWallMm: value.observedMinimumWallMm as number,
    }),
});
export const run = tool.execute;
export default tool;
