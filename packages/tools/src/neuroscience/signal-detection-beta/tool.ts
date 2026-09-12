import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  fraction,
  normalQuantile,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualHitFraction: number;
  readonly actualFalseAlarmFraction: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualHitFraction", label: "Actual hit fraction", kind: "number" },
  {
    id: "actualFalseAlarmFraction",
    label: "Actual false alarm fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  fraction(input.actualHitFraction, "actualHitFraction");
  fraction(input.actualFalseAlarmFraction, "actualFalseAlarmFraction");
  if (
    input.actualHitFraction <= 0 ||
    input.actualHitFraction >= 1 ||
    input.actualFalseAlarmFraction <= 0 ||
    input.actualFalseAlarmFraction >= 1
  )
    simpleError("fractions", "Actualinteriorfractions.");
  return {
    value: Math.exp(
      (normalQuantile(input.actualFalseAlarmFraction) ** 2 -
        normalQuantile(input.actualHitFraction) ** 2) /
        2,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualHitFraction: 0.75, actualFalseAlarmFraction: 0.25 },
  output: { result: { value: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/signal-detection-beta",
  title: "Signal Detection Beta Calculator",
  description:
    "Equal-variance Gaussian likelihood criterion\u03b2=exp[(zFA\u00b2\u2212zH\u00b2)/2], not dprimeorc; actual interior fractions. Actual independently matched observations/units and protocol, not diagnosis, causal mechanism, clinical decision or validated individual prediction.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
