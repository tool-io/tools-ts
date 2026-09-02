import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedApiarySpacingKeys: readonly string[];
  readonly callerVerifiedApiarySpacingNotices: readonly string[];
  readonly queryApiarySpacingKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedApiarySpacingKeys",
    label: "Caller verified apiary spacing keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedApiarySpacingNotices",
    label: "Caller verified apiary spacing notices",
    kind: "stringList",
  },
  {
    id: "queryApiarySpacingKey",
    label: "Query apiary spacing key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedApiarySpacingKeys,
      input.callerVerifiedApiarySpacingNotices,
      input.queryApiarySpacingKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedApiarySpacingKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedApiarySpacingNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryApiarySpacingKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/apiary-spacing-hives-per-site-lookup",
  title: "Apiary Spacing Hives Per Site Regulation Lookup",
  description:
    "Caller exact independently verified jurisdiction/date/site apiary spacing regulation notice; no current-law assertion. Exact independently verified context/edition key, not live or embedded reference data. Caller independently verifies strain, site, protocol and evidence; not colony-health, treatment, transport-safety or regulatory certification.",
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
      callerVerifiedApiarySpacingKeys:
        value.callerVerifiedApiarySpacingKeys as readonly string[],
      callerVerifiedApiarySpacingNotices:
        value.callerVerifiedApiarySpacingNotices as readonly string[],
      queryApiarySpacingKey: value.queryApiarySpacingKey as string,
    }),
});
export const run = tool.execute;
export default tool;
