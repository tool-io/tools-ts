import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly observedHcCm: number;
  readonly observedAcCm: number;
  readonly observedFlCm: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "observedHcCm", label: "Observed hc cm", kind: "number" },
  { id: "observedAcCm", label: "Observed ac cm", kind: "number" },
  { id: "observedFlCm", label: "Observed fl cm", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.observedHcCm, "dimension-cm");
  if (input.observedHcCm > 100)
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
  positive(input.observedFlCm, "dimension-cm");
  if (input.observedFlCm > 100)
    simpleError(
      "dimensions",
      "Bounded centimeter measurements; unit mistakes require review.",
    );
  return {
    conditionalEstimatedFetalWeightGrams:
      10 **
      (1.326 -
        0.00326 * input.observedAcCm * input.observedFlCm +
        0.0107 * input.observedHcCm +
        0.0438 * input.observedAcCm +
        0.158 * input.observedFlCm),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { observedHcCm: 30, observedAcCm: 30, observedFlCm: 6 },
  output: {
    result: { conditionalEstimatedFetalWeightGrams: 2099.9067037624263 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pregnancy/estimated-fetal-weight-hadlock-3param",
  title: "Hadlock 3-Parameter EFW Calculator",
  description:
    "Named HadlockHC/AC/FL three-parameter log10gram model with all actual ultrasound dimensions in CENTIMETERS, not millimeters. Formula-specific estimated weight is not observed fetal mass, gestational age, growth percentile, viability or clinical decision; qualified measurement/formula applicability review required.",
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
