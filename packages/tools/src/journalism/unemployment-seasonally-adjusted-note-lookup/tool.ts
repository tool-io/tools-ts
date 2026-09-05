import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedSeasonalAdjustmentKeys: readonly string[];
  readonly callerVerifiedSeasonalAdjustmentNotices: readonly string[];
  readonly querySeasonalAdjustmentKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedSeasonalAdjustmentKeys",
    label: "Caller verified seasonal adjustment keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedSeasonalAdjustmentNotices",
    label: "Caller verified seasonal adjustment notices",
    kind: "stringList",
  },
  {
    id: "querySeasonalAdjustmentKey",
    label: "Query seasonal adjustment key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedSeasonalAdjustmentKeys,
      input.callerVerifiedSeasonalAdjustmentNotices,
      input.querySeasonalAdjustmentKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedSeasonalAdjustmentKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedSeasonalAdjustmentNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  querySeasonalAdjustmentKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/unemployment-seasonally-adjusted-note-lookup",
  title: "Unemployment Seasonally Adjusted Note Lookup",
  description:
    "Independently verified agency/series/edition seasonal-adjustment method and revision notice, not fabricate an adjustment from one unemployment value. Exact independently verified context/edition key; not embedded or live reference data. Caller independently verifies context, evidence, reference edition and applicability; not factual authenticity, current legal advice or publication clearance.",
  inputs: inputFields,
  outputs: [
    {
      id: "matchedCallerNotice",
      label: "Matched caller notice",
      kind: "string",
    },
  ],
  calculate: (value) =>
    calculate({
      callerVerifiedSeasonalAdjustmentKeys:
        value.callerVerifiedSeasonalAdjustmentKeys as readonly string[],
      callerVerifiedSeasonalAdjustmentNotices:
        value.callerVerifiedSeasonalAdjustmentNotices as readonly string[],
      querySeasonalAdjustmentKey: value.querySeasonalAdjustmentKey as string,
    }),
});
export const run = tool.execute;
export default tool;
