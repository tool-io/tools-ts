import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError, mean } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualIndependentDirectionalKurtosisSamples: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentDirectionalKurtosisSamples",
    label: "Actual independent directional kurtosis samples",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.actualIndependentDirectionalKurtosisSamples.length)
    simpleError(
      "actualIndependentDirectionalKurtosisSamples",
      "Actual nonempty observations.",
    );
  return { value: mean(input.actualIndependentDirectionalKurtosisSamples) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualIndependentDirectionalKurtosisSamples: [1, 2, 3] },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/kurtosis-mean",
  title: "Mean Kurtosis Calculator",
  description:
    "Arithmetic directional mean diffusion kurtosis under independently established uniform spherical quadrature, equally weighted directions, not scalar raw sample distribution kurtosis or full tensor fit. Actual independently matched observations/units and protocol, not diagnosis, causal mechanism, clinical decision or validated individual prediction.",
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
