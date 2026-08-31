import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../batch-shared.js";
export type Input = Readonly<{ readonly sortCodeText: string }>;
export type Output = Readonly<{
  readonly canonicalSortCodeDigits: string;
  readonly hyphenatedSortCode: string;
}>;
const inputFields = [
  { id: "sortCodeText", label: "Sort code text", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    !/^(?:[0-9]{6}|[0-9]{2}-[0-9]{2}-[0-9]{2})$(?![\s\S])/.test(
      input.sortCodeText,
    )
  )
    simpleError(
      "sortCode",
      "Exact six ASCII digits or DD-DD-DD sort-code notation required.",
    );
  const digits = input.sortCodeText.replace(/-/g, "");
  return {
    canonicalSortCodeDigits: digits,
    hyphenatedSortCode:
      digits.slice(0, 2) + "-" + digits.slice(2, 4) + "-" + digits.slice(4),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { sortCodeText: "01-02-03" } satisfies Input;
export const exampleOutput = {
  canonicalSortCodeDigits: "010203",
  hyphenatedSortCode: "01-02-03",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/uk-sort-code-format-parse",
  title: "UK Sort Code Format Parse Tool",
  description:
    "Parse exact UK sort-code notation and preserve leading zeros; format normalization only, no bank/branch assignment, account match, checksum or payment-network eligibility.",
  inputs: inputFields,
  outputs: [
    {
      id: "canonicalSortCodeDigits",
      label: "Canonical sort code digits",
      kind: "string",
    },
    { id: "hyphenatedSortCode", label: "Hyphenated sort code", kind: "string" },
  ],
  calculate: (value) =>
    calculate({ sortCodeText: value.sortCodeText as string }),
});
export const run = tool.execute;
export default tool;
