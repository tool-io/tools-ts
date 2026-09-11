import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyResolvedMetabolizedMassPerHour: number;
  readonly matchedSubstrateConcentrationMassPerLiter: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyResolvedMetabolizedMassPerHour",
    label: "Actual independently resolved metabolized mass per hour",
    kind: "number",
  },
  {
    id: "matchedSubstrateConcentrationMassPerLiter",
    label: "Matched substrate concentration mass per liter",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualIndependentlyResolvedMetabolizedMassPerHour,
    "numerator",
  );
  positive(input.matchedSubstrateConcentrationMassPerLiter, "denominator");
  return {
    observedRatio:
      (1 * input.actualIndependentlyResolvedMetabolizedMassPerHour) /
      input.matchedSubstrateConcentrationMassPerLiter,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualIndependentlyResolvedMetabolizedMassPerHour: 2,
    matchedSubstrateConcentrationMassPerLiter: 4,
  },
  output: { result: { observedRatio: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/adme-metabolism-clearance",
  title: "Metabolism Clearance Calculator",
  description:
    "Actual independently attributed metabolism clearance volume/time, not whole-body total clearance. Actual independently matched quantities/units required; not infer causal effect, clinical guidance or safe design.",
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
