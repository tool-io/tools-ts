import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly observedBpdCm: number;
  readonly observedAcCm: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "observedBpdCm", label: "Observed bpd cm", kind: "number" },
  { id: "observedAcCm", label: "Observed ac cm", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.observedBpdCm, "dimension-cm");
  if (input.observedBpdCm > 100)
    simpleError(
      "dimensions",
      "Bounded centimeter measurements; unit mistakes require review.",
    );
  positive(input.observedAcCm, "dimension-cm");
  if (input.observedAcCm > 100)
    simpleError(
      "dimensions",
      "Bounded centimeter measurements; unit mistakes require review.",
    );
  return {
    conditionalEstimatedFetalWeightGrams:
      1000 *
      10 **
        (-1.7492 +
          0.166 * input.observedBpdCm +
          0.046 * input.observedAcCm -
          0.002646 * input.observedBpdCm * input.observedAcCm),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { observedBpdCm: 8, observedAcCm: 30 },
  output: {
    result: { conditionalEstimatedFetalWeightGrams: 2107.4632008715284 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pregnancy/estimated-fetal-weight-shepard",
  title: "Shepard EFW Calculator",
  description:
    "Named ShepardBPD/AC log10kilogram model with all actual ultrasound dimensions in CENTIMETERS, not millimeters. Formula-specific estimated weight is not observed fetal mass, gestational age, growth percentile, viability or clinical decision; qualified measurement/formula applicability review required.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
