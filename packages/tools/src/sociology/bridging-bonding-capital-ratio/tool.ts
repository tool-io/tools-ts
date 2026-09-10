import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly independentlyClassifiedBridgingTieCounts: readonly number[];
  readonly independentlyClassifiedBondingTieCounts: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyClassifiedBridgingTieCounts",
    label: "Independently classified bridging tie counts",
    kind: "numberList",
  },
  {
    id: "independentlyClassifiedBondingTieCounts",
    label: "Independently classified bonding tie counts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.independentlyClassifiedBridgingTieCounts,
    input.independentlyClassifiedBondingTieCounts,
    "cohorts",
  );
  [
    input.independentlyClassifiedBridgingTieCounts,
    input.independentlyClassifiedBondingTieCounts,
  ].forEach((v) => v.forEach((x) => nonnegative(x, "count")));
  return {
    observedBridgingBondingRatio:
      sum(input.independentlyClassifiedBridgingTieCounts) /
      positive(sum(input.independentlyClassifiedBondingTieCounts), "bonding"),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyClassifiedBridgingTieCounts: [2, 4],
    independentlyClassifiedBondingTieCounts: [1, 2],
  },
  output: { result: { observedBridgingBondingRatio: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/bridging-bonding-capital-ratio",
  title: "Bridging/Bonding Capital Ratio Calculator",
  description:
    "Actual independently classified tie inventories; exclusive/multiple classification convention must be caller declared. No identity-based assumptions about who counts as bridging or social-quality judgment.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
