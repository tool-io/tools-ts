import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualClosureMagnitudeMeters: number;
  readonly actualSurveyedLoopLengthMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualClosureMagnitudeMeters",
    label: "Actual closure magnitude meters",
    kind: "number",
  },
  {
    id: "actualSurveyedLoopLengthMeters",
    label: "Actual surveyed loop length meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualClosureMagnitudeMeters, "closure");
  positive(input.actualSurveyedLoopLengthMeters, "length");
  const p =
    (100 * input.actualClosureMagnitudeMeters) /
    input.actualSurveyedLoopLengthMeters;
  return { observedMisclosurePercent: p, withinNominalOnePercentRule: p <= 1 };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualClosureMagnitudeMeters: 1,
    actualSurveyedLoopLengthMeters: 100,
  },
  output: {
    result: { observedMisclosurePercent: 1, withinNominalOnePercentRule: true },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/misclosure-ratio-grade",
  title: "Misclosure Ratio Quality Grade Checker (1% rule)",
  description:
    "Raw closure magnitude/complete actual looplength\u00d7100; inclusive nominal1 percent bookkeeping rule only. Not a universal survey grade, accuracy confidence or certification.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
