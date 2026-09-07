import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  simpleError,
  type SimpleField,
} from "../../core/simple.js";
import { validateRandomInput, finish, repertoire } from "../batch42-shared.js";

const source = {
  ranges: [
    [12353, 12353],
    [12355, 12355],
    [12357, 12357],
    [12359, 12359],
    [12361, 12361],
    [12387, 12387],
    [12419, 12419],
    [12421, 12421],
    [12423, 12423],
    [12430, 12430],
    [12437, 12438],
    [12449, 12449],
    [12451, 12451],
    [12453, 12453],
    [12455, 12455],
    [12457, 12457],
    [12483, 12483],
    [12515, 12515],
    [12517, 12517],
    [12519, 12519],
    [12526, 12526],
    [12533, 12534],
    [12784, 12799],
    [65383, 65391],
    [110898, 110898],
    [110928, 110930],
    [110933, 110933],
    [110948, 110951],
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
  return repertoire(source, 58, input, context);
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
  id: "random/small-kana-character",
  title: "Random Small Kana Character Generator",
  description:
    "Unicode 17.0.0 assigned repertoire: assigned named HIRAGANA/KATAKANA LETTER SMALL characters. Sources https://www.unicode.org/Public/17.0.0/ucd/UnicodeData.txt and Scripts.txt; no font/rendering or language-validity guarantee. Invisible/control/combining values are intentional test data, not safe UI text. Uniform pinned repertoire-entry sampling; without replacement means distinct entry indices, not guaranteed distinct rendered glyphs. Reproducible seed or one advancing caller source; not secure randomness.",
  inputs: inputFields,
  outputs: [
    { id: "result", label: "Reproducible sample and evidence", kind: "object" },
  ],
  calculate: (input, context) => calculate(input as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
