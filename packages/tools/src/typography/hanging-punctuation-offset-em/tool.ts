import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../shared.js";
export type Input = Readonly<{
  readonly punctuationAdvanceUnits: number;
  readonly punctuationVisibleInkLeftUnits: number;
  readonly callerOutsideMarginFraction: number;
  readonly unitsPerEm: number;
}>;
export type Output = Readonly<{
  readonly hangingOffsetEm: number;
  readonly remainingAdvanceInsideMarginEm: number;
}>;
const inputFields = [
  {
    id: "punctuationAdvanceUnits",
    label: "Punctuation advance units",
    kind: "number",
  },
  {
    id: "punctuationVisibleInkLeftUnits",
    label: "Punctuation visible ink left units",
    kind: "number",
  },
  {
    id: "callerOutsideMarginFraction",
    label: "Caller outside margin fraction",
    kind: "number",
  },
  { id: "unitsPerEm", label: "Units per em", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.unitsPerEm, "unitsPerEm");
  nonnegative(input.punctuationAdvanceUnits, "punctuationAdvanceUnits");
  nonnegative(
    input.punctuationVisibleInkLeftUnits,
    "punctuationVisibleInkLeftUnits",
  );
  fraction(input.callerOutsideMarginFraction, "callerOutsideMarginFraction");
  if (input.punctuationVisibleInkLeftUnits > input.punctuationAdvanceUnits)
    simpleError("ink", "Ink left edge must lie within declared advance.");
  const off =
    -(
      input.punctuationVisibleInkLeftUnits +
      (input.punctuationAdvanceUnits - input.punctuationVisibleInkLeftUnits) *
        input.callerOutsideMarginFraction
    ) / input.unitsPerEm;
  return {
    hangingOffsetEm: off,
    remainingAdvanceInsideMarginEm:
      input.punctuationAdvanceUnits / input.unitsPerEm + off,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  punctuationAdvanceUnits: 500,
  punctuationVisibleInkLeftUnits: 100,
  callerOutsideMarginFraction: 0.5,
  unitsPerEm: 1000,
} satisfies Input;
export const exampleOutput = {
  hangingOffsetEm: -0.3,
  remainingAdvanceInsideMarginEm: 0.2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/hanging-punctuation-offset-em",
  title: "Hanging Punctuation Offset em",
  description:
    "Budget signed hanging-punctuation translation from measured bearing/advance and caller exterior fraction; no universal optical margin offset or automatic glyph shaping.",
  inputs: inputFields,
  outputs: [
    { id: "hangingOffsetEm", label: "Hanging offset em", kind: "number" },
    {
      id: "remainingAdvanceInsideMarginEm",
      label: "Remaining advance inside margin em",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      punctuationAdvanceUnits: value.punctuationAdvanceUnits as number,
      punctuationVisibleInkLeftUnits:
        value.punctuationVisibleInkLeftUnits as number,
      callerOutsideMarginFraction: value.callerOutsideMarginFraction as number,
      unitsPerEm: value.unitsPerEm as number,
    }),
});
export const run = tool.execute;
export default tool;
