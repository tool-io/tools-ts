import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualQualifiedAxialFailureForceNewtons: number;
  readonly actualOriginalSpecimenAreaSquareMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualQualifiedAxialFailureForceNewtons",
    label: "Actual qualified axial failure force newtons",
    kind: "number",
  },
  {
    id: "actualOriginalSpecimenAreaSquareMeters",
    label: "Actual original specimen area square meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualQualifiedAxialFailureForceNewtons, "numerator");
  positive(input.actualOriginalSpecimenAreaSquareMeters, "denominator");
  return {
    observedRatio:
      (1 * input.actualQualifiedAxialFailureForceNewtons) /
      input.actualOriginalSpecimenAreaSquareMeters,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualQualifiedAxialFailureForceNewtons: 2,
    actualOriginalSpecimenAreaSquareMeters: 4,
  },
  output: { result: { observedRatio: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/geomechanics-unconfined-compressive-strength-ucs",
  title: "Geology Geomechanics Unconfined Compressive Strength UCS Calculator",
  description:
    "Actual intact-rock UCSaxial failure force/original specimen area, not structural pillar capacity or borehole failure model. Actual independently matched quantities/units required; not infer causal effect, clinical guidance or safe design.",
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
