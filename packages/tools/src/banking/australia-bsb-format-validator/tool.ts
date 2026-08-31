import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../batch-shared.js";
export type Input = Readonly<{ readonly bsbText: string }>;
export type Output = Readonly<{
  readonly canonicalBsbDigits: string;
  readonly institutionPrefix: string;
  readonly observedStateDigit: string;
  readonly branchDigits: string;
}>;
const inputFields = [
  { id: "bsbText", label: "Bsb text", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (!/^(?:[0-9]{6}|[0-9]{3}-[0-9]{3})$(?![\s\S])/.test(input.bsbText))
    simpleError(
      "bsb",
      "Exact six ASCII BSB digits or DDD-DDD notation required.",
    );
  const text = input.bsbText.replace("-", "");
  return {
    canonicalBsbDigits: text,
    institutionPrefix: text.slice(0, 2),
    observedStateDigit: text[2],
    branchDigits: text.slice(3),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { bsbText: "012-345" } satisfies Input;
export const exampleOutput = {
  canonicalBsbDigits: "012345",
  institutionPrefix: "01",
  observedStateDigit: "2",
  branchDigits: "345",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/australia-bsb-format-validator",
  title: "Australia BSB Format Validator",
  description:
    "Parse Australian BSB syntax with explicit prefix/state-position/branch digits, preserving zeros; not institution/state assignment, real branch existence, checksum or account eligibility validation.",
  inputs: inputFields,
  outputs: [
    { id: "canonicalBsbDigits", label: "Canonical bsb digits", kind: "string" },
    { id: "institutionPrefix", label: "Institution prefix", kind: "string" },
    { id: "observedStateDigit", label: "Observed state digit", kind: "string" },
    { id: "branchDigits", label: "Branch digits", kind: "string" },
  ],
  calculate: (value) => calculate({ bsbText: value.bsbText as string }),
});
export const run = tool.execute;
export default tool;
