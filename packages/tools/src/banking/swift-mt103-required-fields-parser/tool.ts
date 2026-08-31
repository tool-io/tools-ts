import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, mt103 } from "../batch-shared.js";
export type Input = Readonly<{ readonly normalizedMt103BlockFour: string }>;
export type Output = Readonly<{
  readonly observedTagNames: readonly string[];
  readonly missingRequiredTagGroups: readonly string[];
  readonly requiredTagGroupsPresent: boolean;
  readonly transactionReference: string;
  readonly valueDateYYMMDD: string;
  readonly currencyCode: string;
  readonly amountDecimalText: string;
}>;
const inputFields = [
  {
    id: "normalizedMt103BlockFour",
    label: "Normalized mt103 block four",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return mt103(input.normalizedMt103BlockFour);
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  normalizedMt103BlockFour:
    ":20:TESTREF\n:23B:CRED\n:32A:250101USD100,00\n:50K:TEST SENDER\n:59:TEST RECEIVER",
} satisfies Input;
export const exampleOutput = {
  observedTagNames: ["20", "23B", "32A", "50K", "59"],
  missingRequiredTagGroups: ["71A"],
  requiredTagGroupsPresent: false,
  transactionReference: "TESTREF",
  valueDateYYMMDD: "250101",
  currencyCode: "USD",
  amountDecimalText: "100.00",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/swift-mt103-required-fields-parser",
  title: "SWIFT MT103 Required Fields Parser",
  description:
    "Parse normalized bounded MT103 block-four tags/continuations and required tag-group presence, extracting exact currency/amount text without floating conversion; wrappers, full FIN field grammar, date-century validity and transfer authenticity are not certified.",
  inputs: inputFields,
  outputs: [
    { id: "observedTagNames", label: "Observed tag names", kind: "stringList" },
    {
      id: "missingRequiredTagGroups",
      label: "Missing required tag groups",
      kind: "stringList",
    },
    {
      id: "requiredTagGroupsPresent",
      label: "Required tag groups present",
      kind: "boolean",
    },
    {
      id: "transactionReference",
      label: "Transaction reference",
      kind: "string",
    },
    { id: "valueDateYYMMDD", label: "Value date y y m m d d", kind: "string" },
    { id: "currencyCode", label: "Currency code", kind: "string" },
    { id: "amountDecimalText", label: "Amount decimal text", kind: "string" },
  ],
  calculate: (value) =>
    calculate({
      normalizedMt103BlockFour: value.normalizedMt103BlockFour as string,
    }),
});
export const run = tool.execute;
export default tool;
