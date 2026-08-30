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
  fraction,
  aligned,
  ordered,
} from "../shared.js";
export type Input = Readonly<{
  readonly grooveWidthsMm: readonly number[];
  readonly correctFractions: readonly number[];
  readonly criterionFraction: number;
}>;
export type Output = Readonly<{
  readonly thresholdGrooveWidthMm: number;
}>;
const inputFields = [
  { id: "grooveWidthsMm", label: "Groove widths mm", kind: "numberList" },
  { id: "correctFractions", label: "Correct fractions", kind: "numberList" },
  { id: "criterionFraction", label: "Criterion fraction", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(input.grooveWidthsMm, input.correctFractions, "grooveWidthsMm");
  ordered(input.grooveWidthsMm, "grooveWidthsMm");
  input.grooveWidthsMm.forEach((v) => positive(v, "grooveWidthsMm"));
  input.correctFractions.forEach((v) => fraction(v, "correctFractions"));
  fraction(input.criterionFraction, "criterionFraction");
  if (
    input.correctFractions.some(
      (v, i) => i > 0 && v < input.correctFractions[i - 1],
    )
  )
    simpleError(
      "correctFractions",
      "Monotone orientation-discrimination probabilities required.",
    );
  const i = input.correctFractions.findIndex(
    (v) => v >= input.criterionFraction,
  );
  if (i <= 0)
    simpleError(
      "criterionFraction",
      "Criterion must be bracketed by measured widths.",
    );
  const f =
    (input.criterionFraction - input.correctFractions[i - 1]) /
    (input.correctFractions[i] - input.correctFractions[i - 1]);
  return {
    thresholdGrooveWidthMm: Math.exp(
      Math.log(input.grooveWidthsMm[i - 1]) +
        f * Math.log(input.grooveWidthsMm[i] / input.grooveWidthsMm[i - 1]),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  grooveWidthsMm: [0.5, 1, 2],
  correctFractions: [0.5, 0.75, 1],
  criterionFraction: 0.875,
} satisfies Input;
export const exampleOutput = {
  thresholdGrooveWidthMm: 1.4142135623730951,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/grating-orientation-threshold",
  title: "Grating Orientation Threshold",
  description:
    "Estimate grating-orientation threshold by interpolation in log groove width at a supplied probability criterion; unlike linear two-point separation interpolation.",
  inputs: inputFields,
  outputs: [
    {
      id: "thresholdGrooveWidthMm",
      label: "Threshold groove width mm",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      grooveWidthsMm: value.grooveWidthsMm as readonly number[],
      correctFractions: value.correctFractions as readonly number[],
      criterionFraction: value.criterionFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
