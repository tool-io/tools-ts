import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualThoriumConcentration: number;
  readonly matchedUraniumConcentration: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualThoriumConcentration",
    label: "Actual thorium concentration",
    kind: "number",
  },
  {
    id: "matchedUraniumConcentration",
    label: "Matched uranium concentration",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualThoriumConcentration, "numerator");
  positive(input.matchedUraniumConcentration, "denominator");
  return {
    observedRatio:
      (1 * input.actualThoriumConcentration) /
      input.matchedUraniumConcentration,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualThoriumConcentration: 2, matchedUraniumConcentration: 4 },
  output: { result: { observedRatio: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/th-u-ratio",
  title: "Geology Th U Ratio Calculator",
  description:
    "Actual same-basis thorium/uranium ratio, not radioactive age or equilibrium decay status. Actual independently matched quantities/units required; not infer causal effect, clinical guidance or safe design.",
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
