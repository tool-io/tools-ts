import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  binary,
  dateOrder,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly lossSaleDate: string;
  readonly replacementAcquisitionDates: readonly string[];
  readonly callerSubstantiallyIdenticalFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedReplacementOffsetsDays: readonly number[];
  readonly namedThirtyDayCandidateIndices: readonly number[];
}>;
const inputFields = [
  { id: "lossSaleDate", label: "Loss sale date", kind: "string" },
  {
    id: "replacementAcquisitionDates",
    label: "Replacement acquisition dates",
    kind: "stringList",
  },
  {
    id: "callerSubstantiallyIdenticalFlags",
    label: "Caller substantially identical flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  binary(
    input.callerSubstantiallyIdenticalFlags,
    "callerSubstantiallyIdenticalFlags",
  );
  aligned(
    input.replacementAcquisitionDates,
    input.callerSubstantiallyIdenticalFlags,
    "replacementAcquisitionDates",
  );
  const d = input.replacementAcquisitionDates.map((s) =>
    dateOrder(input.lossSaleDate, s),
  );
  return {
    signedReplacementOffsetsDays: d,
    namedThirtyDayCandidateIndices: d.flatMap((v, i) =>
      Math.abs(v) <= 30 && input.callerSubstantiallyIdenticalFlags[i]
        ? [i]
        : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  lossSaleDate: "2026-03-01",
  replacementAcquisitionDates: ["2026-02-01", "2026-04-01"],
  callerSubstantiallyIdenticalFlags: [1, 1],
} satisfies Input;
export const exampleOutput = {
  signedReplacementOffsetsDays: [-28, 31],
  namedThirtyDayCandidateIndices: [0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/wash-sale-rule-30-day-flag-checker",
  title: "Wash Sale Rule 30 Day Flag Checker",
  description:
    "Named inclusive±30calendar-day replacement candidates with independently established substantial-identity flags; no adjusted basis, account aggregation or actual wash-sale determination. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedReplacementOffsetsDays",
      label: "Signed replacement offsets days",
      kind: "numberList",
    },
    {
      id: "namedThirtyDayCandidateIndices",
      label: "Named thirty day candidate indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      lossSaleDate: value.lossSaleDate as string,
      replacementAcquisitionDates:
        value.replacementAcquisitionDates as readonly string[],
      callerSubstantiallyIdenticalFlags:
        value.callerSubstantiallyIdenticalFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
