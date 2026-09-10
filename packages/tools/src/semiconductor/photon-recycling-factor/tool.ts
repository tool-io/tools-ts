import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  fraction,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly callerIndependentRadiativeReemissionFraction: number;
  readonly callerIndependentReabsorptionFraction: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerIndependentRadiativeReemissionFraction",
    label: "Caller independent radiative reemission fraction",
    kind: "number",
  },
  {
    id: "callerIndependentReabsorptionFraction",
    label: "Caller independent reabsorption fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  fraction(input.callerIndependentRadiativeReemissionFraction, "radiative");
  fraction(input.callerIndependentReabsorptionFraction, "reabsorption");
  if (
    input.callerIndependentRadiativeReemissionFraction *
      input.callerIndependentReabsorptionFraction >=
    1
  )
    simpleError("recycling", "Finite convergent probability product<1.");
  return {
    conditionalGeometricPhotonRecyclingFactor:
      1 /
      (1 -
        input.callerIndependentRadiativeReemissionFraction *
          input.callerIndependentReabsorptionFraction),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerIndependentRadiativeReemissionFraction: 0.5,
    callerIndependentReabsorptionFraction: 0.5,
  },
  output: {
    result: { conditionalGeometricPhotonRecyclingFactor: 1.3333333333333333 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/photon-recycling-factor",
  title: "Semiconductor Photon Recycling Factor Calculator",
  description:
    "Conditional infinite geometric photon recycling1/(1\u2212\u03b7radpabs) under stationary independent recycling assumptions. Both probabilities caller established, product<1; not actual extraction gain or full radiative-transfer calculation.",
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
