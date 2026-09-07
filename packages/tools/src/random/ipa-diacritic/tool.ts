import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  simpleError,
  type SimpleField,
} from "../../core/simple.js";
import { validateRandomInput, finish, repertoire } from "../batch42-shared.js";

const source = {
  values: [
    "\u0325",
    "\u032c",
    "\u0339",
    "\u031c",
    "\u031f",
    "\u0320",
    "\u0308",
    "\u033d",
    "\u0329",
    "\u032f",
    "\u0324",
    "\u0330",
    "\u033c",
    "\u032a",
    "\u033a",
    "\u033b",
    "\u0303",
    "\u031a",
  ],
} as const;
export type Input = Readonly<{
  readonly seed: string;
  readonly count: number;
  readonly withoutReplacement: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const inputFields = [
  { id: "seed", label: "Seed", kind: "string" },
  { id: "count", label: "Count", kind: "number" },
  { id: "withoutReplacement", label: "Without replacement", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext): Output => {
  return repertoire(source, 18, input, context);
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateRandomInput(input, inputFields);
  return finish(compute(input, context));
};
export const example = {
  input: { seed: "tool.io/batch42", count: 1, withoutReplacement: false },
} satisfies ToolExample<Input>;
export const tool = createSimpleTool({
  id: "random/ipa-diacritic",
  title: "Random IPA Diacritic Generator",
  description:
    "Focused explicit combining IPA diacritical mark subset; requires a base to form a transcription. IPA chart:https://www.internationalphoneticassociation.org/content/ipa-chart; Pinyin:https://www.unicode.org/Public/17.0.0/ucd/UnicodeData.txt. Uniform pinned repertoire-entry sampling; without replacement means distinct entry indices, not guaranteed distinct rendered glyphs. Reproducible seed or one advancing caller source; not secure randomness.",
  inputs: inputFields,
  outputs: [
    { id: "result", label: "Reproducible sample and evidence", kind: "object" },
  ],
  calculate: (input, context) => calculate(input as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
