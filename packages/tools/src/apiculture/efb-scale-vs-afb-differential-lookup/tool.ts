import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedEfbAfbDifferentialKeys: readonly string[];
  readonly callerVerifiedEfbAfbDifferentialNotices: readonly string[];
  readonly queryEfbAfbDifferentialKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedEfbAfbDifferentialKeys",
    label: "Caller verified efb afb differential keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedEfbAfbDifferentialNotices",
    label: "Caller verified efb afb differential notices",
    kind: "stringList",
  },
  {
    id: "queryEfbAfbDifferentialKey",
    label: "Query efb afb differential key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedEfbAfbDifferentialKeys,
      input.callerVerifiedEfbAfbDifferentialNotices,
      input.queryEfbAfbDifferentialKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedEfbAfbDifferentialKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedEfbAfbDifferentialNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryEfbAfbDifferentialKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/efb-scale-vs-afb-differential-lookup",
  title: "EFB Scale vs AFB Differential Lookup",
  description:
    "Caller independently verified laboratory/veterinary differential evidence notice, no disease identity from observed scale texture. Exact independently verified context/edition key, not live or embedded reference data. Caller independently verifies strain, site, protocol and evidence; not colony-health, treatment, transport-safety or regulatory certification.",
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
      callerVerifiedEfbAfbDifferentialKeys:
        value.callerVerifiedEfbAfbDifferentialKeys as readonly string[],
      callerVerifiedEfbAfbDifferentialNotices:
        value.callerVerifiedEfbAfbDifferentialNotices as readonly string[],
      queryEfbAfbDifferentialKey: value.queryEfbAfbDifferentialKey as string,
    }),
});
export const run = tool.execute;
export default tool;
