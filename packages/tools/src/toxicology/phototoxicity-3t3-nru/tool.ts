import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredDarkConditionIc50: number;
  readonly independentlyMatchedLightConditionIc50: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredDarkConditionIc50",
    label: "Independently measured dark condition ic50",
    kind: "number",
  },
  {
    id: "independentlyMatchedLightConditionIc50",
    label: "Independently matched light condition ic50",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.independentlyMeasuredDarkConditionIc50, "numerator");
  positive(input.independentlyMatchedLightConditionIc50, "denominator");
  return {
    observedRatio:
      (1 * input.independentlyMeasuredDarkConditionIc50) /
      input.independentlyMatchedLightConditionIc50,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredDarkConditionIc50: 2,
    independentlyMatchedLightConditionIc50: 4,
  },
  output: { result: { observedRatio: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/phototoxicity-3t3-nru",
  title: "Phototoxicity 3T3 NRU Calculator",
  description:
    "Actual3T3NRU phototoxicity PIFdark/light IC50 ratio from independently qualified assay; unelicited/censored IC50 cannot silently be substituted. No phototoxic classification from this ratio alone. Actual independently matched quantities/units required; not infer causal effect, clinical guidance or safe design.",
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
