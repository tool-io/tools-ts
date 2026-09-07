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
    "p",
    "b",
    "t",
    "d",
    "\u0288",
    "\u0256",
    "c",
    "\u025f",
    "k",
    "\u0261",
    "q",
    "\u0262",
    "\u0294",
    "m",
    "\u0271",
    "n",
    "\u0273",
    "\u0272",
    "\u014b",
    "\u0274",
    "\u0299",
    "r",
    "\u0280",
    "\u2c71",
    "\u027e",
    "\u027d",
    "\u0278",
    "\u03b2",
    "f",
    "v",
    "\u03b8",
    "\u00f0",
    "s",
    "z",
    "\u0283",
    "\u0292",
    "\u0282",
    "\u0290",
    "\u00e7",
    "\u029d",
    "x",
    "\u0263",
    "\u03c7",
    "\u0281",
    "\u0127",
    "\u0295",
    "h",
    "\u0266",
    "\u026c",
    "\u026e",
    "\u028b",
    "\u0279",
    "\u027b",
    "j",
    "\u0270",
    "l",
    "\u026d",
    "\u028e",
    "\u029f",
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
  return repertoire(source, 59, input, context);
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
  id: "random/ipa-consonant",
  title: "Random IPA Consonant Generator",
  description:
    "Focused pulmonic consonant chart symbols; excludes affricate tie-bar sequences and nonpulmonics. IPA chart:https://www.internationalphoneticassociation.org/content/ipa-chart; Pinyin:https://www.unicode.org/Public/17.0.0/ucd/UnicodeData.txt. Uniform pinned repertoire-entry sampling; without replacement means distinct entry indices, not guaranteed distinct rendered glyphs. Reproducible seed or one advancing caller source; not secure randomness.",
  inputs: inputFields,
  outputs: [
    { id: "result", label: "Reproducible sample and evidence", kind: "object" },
  ],
  calculate: (input, context) => calculate(input as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
