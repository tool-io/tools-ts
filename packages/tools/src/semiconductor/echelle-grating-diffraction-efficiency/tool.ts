import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyAssignedOrderOpticalPowerWatts: number;
  readonly matchedIncidentGratingPowerWatts: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyAssignedOrderOpticalPowerWatts",
    label: "Actual independently assigned order optical power watts",
    kind: "number",
  },
  {
    id: "matchedIncidentGratingPowerWatts",
    label: "Matched incident grating power watts",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualIndependentlyAssignedOrderOpticalPowerWatts,
    "numerator",
  );
  positive(input.matchedIncidentGratingPowerWatts, "denominator");
  return {
    observedRatio:
      (1 * input.actualIndependentlyAssignedOrderOpticalPowerWatts) /
      input.matchedIncidentGratingPowerWatts,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualIndependentlyAssignedOrderOpticalPowerWatts: 2,
    matchedIncidentGratingPowerWatts: 4,
  },
  output: { result: { observedRatio: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/echelle-grating-diffraction-efficiency",
  title: "Semiconductor Echelle Grating Diffraction Efficiency Calculator",
  description:
    "Actual selected echelle diffraction-order efficiency; not sum all orders or assume a universal blaze curve. Actual independently matched quantities/units required; not infer causal effect, clinical guidance or safe design.",
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
