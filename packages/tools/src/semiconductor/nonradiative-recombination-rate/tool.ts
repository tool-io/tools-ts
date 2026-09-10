import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredTotalRecombinationRate: number;
  readonly independentlySeparatedRadiativeRecombinationRate: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredTotalRecombinationRate",
    label: "Independently measured total recombination rate",
    kind: "number",
  },
  {
    id: "independentlySeparatedRadiativeRecombinationRate",
    label: "Independently separated radiative recombination rate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.independentlyMeasuredTotalRecombinationRate, "first");
  nonnegative(input.independentlySeparatedRadiativeRecombinationRate, "second");
  return {
    signedObservedDifference:
      input.independentlyMeasuredTotalRecombinationRate -
      input.independentlySeparatedRadiativeRecombinationRate,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredTotalRecombinationRate: 5,
    independentlySeparatedRadiativeRecombinationRate: 3,
  },
  output: { result: { signedObservedDifference: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/nonradiative-recombination-rate",
  title: "Semiconductor Nonradiative Recombination Rate Calculator",
  description:
    "Signed nonradiative remainder after independently resolved radiative component; negative residual is inconsistent inventory, not silently a physical negative rate. Actual independently matched units, contexts and definitions; signed differences retained, not a validated risk or safety claim.",
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
