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
    [306, 307],
    [338, 339],
    [1188, 1189],
    [1204, 1205],
    [1236, 1237],
    [1415, 1415],
    [1520, 1522],
    [43001, 43001],
    [64256, 64262],
    [64275, 64279],
    [64287, 64287],
    [64335, 64335],
    [64490, 64507],
    [64512, 64829],
    [64848, 64911],
    [64914, 64967],
    [65008, 65019],
    [65269, 65276],
    [69415, 69415],
    [69622, 69622],
    [70006, 70006],
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
  return repertoire(source, 506, input, context);
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
  id: "random/unicode-ligature",
  title: "Random Unicode Ligature Generator",
  description:
    "Unicode 17.0.0 assigned repertoire: named assigned L-category ligatures, including script-specific and presentation forms. Sources https://www.unicode.org/Public/17.0.0/ucd/UnicodeData.txt and Scripts.txt; no font/rendering or language-validity guarantee. Invisible/control/combining values are intentional test data, not safe UI text. Uniform pinned repertoire-entry sampling; without replacement means distinct entry indices, not guaranteed distinct rendered glyphs. Reproducible seed or one advancing caller source; not secure randomness.",
  inputs: inputFields,
  outputs: [
    { id: "result", label: "Reproducible sample and evidence", kind: "object" },
  ],
  calculate: (input, context) => calculate(input as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
