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
    "\u0101",
    "\u00e1",
    "\u01ce",
    "\u00e0",
    "\u0113",
    "\u00e9",
    "\u011b",
    "\u00e8",
    "\u012b",
    "\u00ed",
    "\u01d0",
    "\u00ec",
    "\u014d",
    "\u00f3",
    "\u01d2",
    "\u00f2",
    "\u016b",
    "\u00fa",
    "\u01d4",
    "\u00f9",
    "\u01d6",
    "\u01d8",
    "\u01da",
    "\u01dc",
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
  return repertoire(source, 24, input, context);
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
  id: "random/pinyin-tone-marked-vowel",
  title: "Random Pinyin Tone-Marked Vowel Generator",
  description:
    "Focused Pinyin four-tone a/e/i/o/u/\u00fc precomposed vowel subset, excludes neutral unmarked vowels. IPA chart:https://www.internationalphoneticassociation.org/content/ipa-chart; Pinyin:https://www.unicode.org/Public/17.0.0/ucd/UnicodeData.txt. Uniform pinned repertoire-entry sampling; without replacement means distinct entry indices, not guaranteed distinct rendered glyphs. Reproducible seed or one advancing caller source; not secure randomness.",
  inputs: inputFields,
  outputs: [
    { id: "result", label: "Reproducible sample and evidence", kind: "object" },
  ],
  calculate: (input, context) => calculate(input as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
