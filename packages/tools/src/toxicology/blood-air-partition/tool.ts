import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualWholeBloodConcentration: number;
  readonly matchedAirConcentration: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualWholeBloodConcentration",
    label: "Actual whole blood concentration",
    kind: "number",
  },
  {
    id: "matchedAirConcentration",
    label: "Matched air concentration",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualWholeBloodConcentration, "numerator");
  positive(input.matchedAirConcentration, "denominator");
  return {
    observedRatio:
      (1 * input.actualWholeBloodConcentration) / input.matchedAirConcentration,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualWholeBloodConcentration: 2, matchedAirConcentration: 4 },
  output: { result: { observedRatio: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/blood-air-partition",
  title: "Blood-Air Partition Calculator",
  description:
    "Actual whole-blood/air same-volume-unit partition ratio, not automatically transform ppmv, mass concentration or assume equilibrium. Actual independently matched quantities/units required; not infer causal effect, clinical guidance or safe design.",
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
