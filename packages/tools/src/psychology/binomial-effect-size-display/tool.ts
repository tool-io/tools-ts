import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch49-shared.js";
export type Input = Readonly<{ readonly actualCompatibleCorrelation: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualCompatibleCorrelation",
    label: "Actual compatible correlation",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (Math.abs(input.actualCompatibleCorrelation) > 1)
    simpleError("r", "Correlation−1…1.");
  return {
    illustrativeFirstGroupSuccessFraction:
      0.5 + input.actualCompatibleCorrelation / 2,
    illustrativeSecondGroupSuccessFraction:
      0.5 - input.actualCompatibleCorrelation / 2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualCompatibleCorrelation: 0.4 },
  output: {
    result: {
      illustrativeFirstGroupSuccessFraction: 0.7,
      illustrativeSecondGroupSuccessFraction: 0.3,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/binomial-effect-size-display",
  title: "Binomial Effect Size Display Calculator",
  description:
    "BinomialEffectSizeDisplaybalanced50percent base-rate illustration .5\u00b1r/2, not actual participant probability or causal group difference.",
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
