import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualDopantConcentrationInOxide: number;
  readonly matchedDopantConcentrationInSilicon: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualDopantConcentrationInOxide",
    label: "Actual dopant concentration in oxide",
    kind: "number",
  },
  {
    id: "matchedDopantConcentrationInSilicon",
    label: "Matched dopant concentration in silicon",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualDopantConcentrationInOxide, "numerator");
  positive(input.matchedDopantConcentrationInSilicon, "denominator");
  return {
    observedRatio:
      (1 * input.actualDopantConcentrationInOxide) /
      input.matchedDopantConcentrationInSilicon,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualDopantConcentrationInOxide: 2,
    matchedDopantConcentrationInSilicon: 4,
  },
  output: { result: { observedRatio: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/dopant-segregation-at-oxide",
  title: "Semiconductor Dopant Segregation At Oxide Calculator",
  description:
    "Explicit oxide-to-silicon actual same-unit segregation partition convention, not silently its inverse or an equilibrium prediction. Actual independently matched quantities/units required; not infer causal effect, clinical guidance or safe design.",
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
