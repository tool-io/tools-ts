import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedJumpLinePlacementKeys: readonly string[];
  readonly callerVerifiedJumpLinePlacementNotices: readonly string[];
  readonly queryJumpLinePlacementKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedJumpLinePlacementKeys",
    label: "Caller verified jump line placement keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedJumpLinePlacementNotices",
    label: "Caller verified jump line placement notices",
    kind: "stringList",
  },
  {
    id: "queryJumpLinePlacementKey",
    label: "Query jump line placement key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedJumpLinePlacementKeys,
      input.callerVerifiedJumpLinePlacementNotices,
      input.queryJumpLinePlacementKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedJumpLinePlacementKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedJumpLinePlacementNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryJumpLinePlacementKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/jump-page-continued-line-placement-lookup",
  title: "Jump Page Continued Line Placement Lookup",
  description:
    "Caller independently verified issue/layout house policy jump/continued line placement, not automatic page-flow layout. Exact independently verified context/edition key; not embedded or live reference data. Caller independently verifies context, evidence, reference edition and applicability; not factual authenticity, current legal advice or publication clearance.",
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
      callerVerifiedJumpLinePlacementKeys:
        value.callerVerifiedJumpLinePlacementKeys as readonly string[],
      callerVerifiedJumpLinePlacementNotices:
        value.callerVerifiedJumpLinePlacementNotices as readonly string[],
      queryJumpLinePlacementKey: value.queryJumpLinePlacementKey as string,
    }),
});
export const run = tool.execute;
export default tool;
