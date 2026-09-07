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
    [173, 173],
    [1536, 1541],
    [1564, 1564],
    [1757, 1757],
    [1807, 1807],
    [2192, 2193],
    [2274, 2274],
    [6158, 6158],
    [8203, 8207],
    [8234, 8238],
    [8288, 8292],
    [8294, 8303],
    [65279, 65279],
    [65529, 65531],
    [69821, 69821],
    [69837, 69837],
    [78896, 78911],
    [113824, 113827],
    [119155, 119162],
    [917505, 917505],
    [917536, 917631],
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
  return repertoire(source, 170, input, context);
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
  id: "random/unicode-format-control",
  title: "Random Unicode Format Control Generator",
  description:
    "Unicode 17.0.0 assigned repertoire: GeneralCategoryCf format controls, including invisible and bidi-affecting values. Sources https://www.unicode.org/Public/17.0.0/ucd/UnicodeData.txt and Scripts.txt; no font/rendering or language-validity guarantee. Invisible/control/combining values are intentional test data, not safe UI text. Uniform pinned repertoire-entry sampling; without replacement means distinct entry indices, not guaranteed distinct rendered glyphs. Reproducible seed or one advancing caller source; not secure randomness.",
  inputs: inputFields,
  outputs: [
    { id: "result", label: "Reproducible sample and evidence", kind: "object" },
  ],
  calculate: (input, context) => calculate(input as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
