import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  bounded,
  simpleError,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly independentlyAnnotatedPaletteIds: readonly string[];
  readonly callerPreferredMaximumDistinctColors: number;
  readonly callerPenaltyPerExtraColor: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyAnnotatedPaletteIds",
    label: "Independently annotated palette ids",
    kind: "stringList",
  },
  {
    id: "callerPreferredMaximumDistinctColors",
    label: "Caller preferred maximum distinct colors",
    kind: "number",
  },
  {
    id: "callerPenaltyPerExtraColor",
    label: "Caller penalty per extra color",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.callerPreferredMaximumDistinctColors, "maximum", 0, 128);
  nonnegative(input.callerPenaltyPerExtraColor, "penalty");
  if (
    !input.independentlyAnnotatedPaletteIds.length ||
    input.independentlyAnnotatedPaletteIds.some((v) => !v.trim())
  )
    simpleError("palette", "Explicit nonempty palette identity inventory.");
  const n = new Set(input.independentlyAnnotatedPaletteIds).size,
    extra = Math.max(0, n - input.callerPreferredMaximumDistinctColors);
  return {
    distinctColorCount: n,
    extraColorCount: extra,
    callerPenalty: extra * input.callerPenaltyPerExtraColor,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyAnnotatedPaletteIds: ["red", "red", "white", "blue"],
    callerPreferredMaximumDistinctColors: 2,
    callerPenaltyPerExtraColor: 3,
  },
  output: {
    result: { distinctColorCount: 3, extraColorCount: 1, callerPenalty: 3 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/color-count-penalty-scorer",
  title: "Color Count Penalty Scorer",
  description:
    "Deduplicate independently defined palette IDs then apply caller linear extra-colour penalty; no universal colour maximum or automated visual distinction.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
