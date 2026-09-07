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
    "i",
    "y",
    "\u0268",
    "\u0289",
    "\u026f",
    "u",
    "\u026a",
    "\u028f",
    "\u028a",
    "e",
    "\u00f8",
    "\u0258",
    "\u0275",
    "\u0264",
    "o",
    "\u0259",
    "\u025b",
    "\u0153",
    "\u025c",
    "\u025e",
    "\u028c",
    "\u0254",
    "\u00e6",
    "\u0250",
    "a",
    "\u0276",
    "\u0251",
    "\u0252",
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
  return repertoire(source, 28, input, context);
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
  id: "random/ipa-vowel",
  title: "Random IPA Vowel Generator",
  description:
    "Focused standard IPA vowel-chart symbols, not allophonic inventory of one language. IPA chart:https://www.internationalphoneticassociation.org/content/ipa-chart; Pinyin:https://www.unicode.org/Public/17.0.0/ucd/UnicodeData.txt. Uniform pinned repertoire-entry sampling; without replacement means distinct entry indices, not guaranteed distinct rendered glyphs. Reproducible seed or one advancing caller source; not secure randomness.",
  inputs: inputFields,
  outputs: [
    { id: "result", label: "Reproducible sample and evidence", kind: "object" },
  ],
  calculate: (input, context) => calculate(input as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
