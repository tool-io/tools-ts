import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedLateralTypeKeys: readonly string[];
  readonly callerVerifiedLateralTypeNotices: readonly string[];
  readonly queryLateralTypeKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedLateralTypeKeys",
    label: "Caller verified lateral type keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedLateralTypeNotices",
    label: "Caller verified lateral type notices",
    kind: "stringList",
  },
  {
    id: "queryLateralTypeKey",
    label: "Query lateral type key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedLateralTypeKeys,
      input.callerVerifiedLateralTypeNotices,
      input.queryLateralTypeKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedLateralTypeKeys: ["context-a/edition-a", "context-a/edition-b"],
  callerVerifiedLateralTypeNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryLateralTypeKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/lateral-types-inventory-lookup",
  title: "Lateral Types Inventory Lookup",
  description:
    "Caller independently documented lateral phonetic inventory/class reference. Exact independently verified context/edition key, not live or embedded reference data. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
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
      callerVerifiedLateralTypeKeys:
        value.callerVerifiedLateralTypeKeys as readonly string[],
      callerVerifiedLateralTypeNotices:
        value.callerVerifiedLateralTypeNotices as readonly string[],
      queryLateralTypeKey: value.queryLateralTypeKey as string,
    }),
});
export const run = tool.execute;
export default tool;
