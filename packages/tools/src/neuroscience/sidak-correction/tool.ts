import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  fraction,
  bounded,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly callerFamilyAlpha: number;
  readonly actualIndependentTestCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "callerFamilyAlpha", label: "Caller family alpha", kind: "number" },
  {
    id: "actualIndependentTestCount",
    label: "Actual independent test count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  fraction(input.callerFamilyAlpha, "callerFamilyAlpha");
  bounded(
    input.actualIndependentTestCount,
    "actualIndependentTestCount",
    1,
    1000000,
  );
  if (input.callerFamilyAlpha >= 1) simpleError("alpha", "Familyalpha<1.");
  return {
    value: -Math.expm1(
      Math.log1p(-input.callerFamilyAlpha) / input.actualIndependentTestCount,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { callerFamilyAlpha: 0.05, actualIndependentTestCount: 2 },
  output: { result: { value: 0.025320565519103666 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/sidak-correction",
  title: "Sidak Correction Calculator",
  description:
    "Sidak per test alpha1\u2212(1\u2212family alpha)^(1/m), independence assumption explicit; not Bonferroni or arbitrary correlated voxel control. Actual independently matched observations/units and protocol, not diagnosis, causal mechanism, clinical decision or validated individual prediction.",
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
