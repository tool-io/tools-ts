import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedNameOrderKeys: readonly string[];
  readonly callerVerifiedNameOrderNotices: readonly string[];
  readonly queryNameOrderKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedNameOrderKeys",
    label: "Caller verified name order keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedNameOrderNotices",
    label: "Caller verified name order notices",
    kind: "stringList",
  },
  { id: "queryNameOrderKey", label: "Query name order key", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedNameOrderKeys,
      input.callerVerifiedNameOrderNotices,
      input.queryNameOrderKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedNameOrderKeys: ["context-a/edition-a", "context-a/edition-b"],
  callerVerifiedNameOrderNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryNameOrderKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/name-order-family-first-culture-classifier",
  title: "Family-First Name Order Culture Classifier",
  description:
    "Independently verified locale/context/caller name-order reference, no parsing a personal name or inferring nationality. Exact independently verified context/edition key, not live or embedded reference data. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
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
      callerVerifiedNameOrderKeys:
        value.callerVerifiedNameOrderKeys as readonly string[],
      callerVerifiedNameOrderNotices:
        value.callerVerifiedNameOrderNotices as readonly string[],
      queryNameOrderKey: value.queryNameOrderKey as string,
    }),
});
export const run = tool.execute;
export default tool;
