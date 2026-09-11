import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualHairMercuryConcentration: number;
  readonly matchedBloodMercuryConcentration: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualHairMercuryConcentration",
    label: "Actual hair mercury concentration",
    kind: "number",
  },
  {
    id: "matchedBloodMercuryConcentration",
    label: "Matched blood mercury concentration",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualHairMercuryConcentration, "numerator");
  positive(input.matchedBloodMercuryConcentration, "denominator");
  return {
    observedRatio:
      (1 * input.actualHairMercuryConcentration) /
      input.matchedBloodMercuryConcentration,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualHairMercuryConcentration: 2,
    matchedBloodMercuryConcentration: 4,
  },
  output: { result: { observedRatio: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/mercury-hair-blood-ratio",
  title: "Mercury Hair-to-Blood Ratio Calculator",
  description:
    "Actual paired same-unit hair/blood mercury ratio, species/formulation, sampling times and mass/volume basis externally harmonized. Actual independently matched quantities/units required; not infer causal effect, clinical guidance or safe design.",
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
