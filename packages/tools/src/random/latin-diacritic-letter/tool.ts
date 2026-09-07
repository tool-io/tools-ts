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
    [192, 197],
    [199, 207],
    [209, 214],
    [216, 221],
    [224, 229],
    [231, 239],
    [241, 246],
    [248, 253],
    [255, 304],
    [308, 311],
    [313, 328],
    [332, 337],
    [340, 382],
    [384, 387],
    [391, 392],
    [394, 396],
    [401, 403],
    [407, 411],
    [413, 417],
    [420, 421],
    [427, 432],
    [434, 438],
    [442, 443],
    [446, 446],
    [452, 454],
    [456, 456],
    [459, 459],
    [461, 476],
    [478, 496],
    [498, 498],
    [500, 501],
    [504, 539],
    [542, 545],
    [548, 566],
    [570, 576],
    [579, 579],
    [582, 591],
    [595, 595],
    [597, 599],
    [602, 602],
    [605, 605],
    [607, 608],
    [614, 616],
    [619, 621],
    [624, 627],
    [634, 639],
    [642, 642],
    [644, 644],
    [646, 646],
    [648, 648],
    [651, 651],
    [656, 657],
    [659, 659],
    [667, 667],
    [669, 669],
    [672, 674],
    [677, 677],
    [680, 680],
    [686, 687],
    [7436, 7436],
    [7443, 7443],
    [7532, 7542],
    [7546, 7578],
    [7680, 7837],
    [7840, 7929],
    [7934, 7935],
    [11360, 11372],
    [11374, 11374],
    [11377, 11380],
    [11384, 11386],
    [11390, 11391],
    [42798, 42799],
    [42810, 42811],
    [42814, 42821],
    [42824, 42829],
    [42832, 42841],
    [42846, 42847],
    [42852, 42855],
    [42894, 42894],
    [42896, 42905],
    [42912, 42922],
    [42925, 42925],
    [42930, 42930],
    [42936, 42937],
    [42948, 42954],
    [42956, 42957],
    [42972, 42972],
    [43828, 43828],
    [43830, 43836],
    [43838, 43839],
    [43841, 43842],
    [43844, 43844],
    [43846, 43846],
    [43849, 43850],
    [43852, 43852],
    [43854, 43855],
    [43858, 43858],
    [43860, 43866],
    [43878, 43880],
    [122624, 122624],
    [122628, 122630],
    [122632, 122639],
    [122641, 122654],
    [122661, 122666],
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
  return repertoire(source, 823, input, context);
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
  id: "random/latin-diacritic-letter",
  title: "Random Latin Diacritic Letter Generator",
  description:
    "Unicode 17.0.0 assigned repertoire: named LATIN letters WITH diacritical modifications; explicit named subset, not every accented language spelling. Sources https://www.unicode.org/Public/17.0.0/ucd/UnicodeData.txt and Scripts.txt; no font/rendering or language-validity guarantee. Invisible/control/combining values are intentional test data, not safe UI text. Uniform pinned repertoire-entry sampling; without replacement means distinct entry indices, not guaranteed distinct rendered glyphs. Reproducible seed or one advancing caller source; not secure randomness.",
  inputs: inputFields,
  outputs: [
    { id: "result", label: "Reproducible sample and evidence", kind: "object" },
  ],
  calculate: (input, context) => calculate(input as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
