import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, fraction, bounded } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly callerFamilyAlpha: number;
  readonly actualFamilyTestCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "callerFamilyAlpha", label: "Caller family alpha", kind: "number" },
  {
    id: "actualFamilyTestCount",
    label: "Actual family test count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  fraction(input.callerFamilyAlpha, "callerFamilyAlpha");
  bounded(input.actualFamilyTestCount, "actualFamilyTestCount", 1, 1000000);
  return { value: input.callerFamilyAlpha / input.actualFamilyTestCount };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { callerFamilyAlpha: 0.05, actualFamilyTestCount: 5 },
  output: { result: { value: 0.01 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/family-wise-error-correction",
  title: "Family-Wise Error Correction Calculator",
  description:
    "Explicit Bonferroniper-test alpha family alpha/m, no independence required; not derive cluster/spatial critical statistic. Actual independently matched observations/units and protocol, not diagnosis, causal mechanism, clinical decision or validated individual prediction.",
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
