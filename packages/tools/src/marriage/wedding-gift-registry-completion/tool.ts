import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualFulfilledDistinctRegistryItems: number;
  readonly actualRequestedDistinctRegistryItems: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualFulfilledDistinctRegistryItems",
    label: "Actual fulfilled distinct registry items",
    kind: "number",
  },
  {
    id: "actualRequestedDistinctRegistryItems",
    label: "Actual requested distinct registry items",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.actualRequestedDistinctRegistryItems, "total", 1, 1000000);
  bounded(
    input.actualFulfilledDistinctRegistryItems,
    "part",
    0,
    input.actualRequestedDistinctRegistryItems,
  );
  nonnegative(input.actualFulfilledDistinctRegistryItems, "numerator");
  positive(input.actualRequestedDistinctRegistryItems, "denominator");
  return {
    observedRatio:
      (100 * input.actualFulfilledDistinctRegistryItems) /
      input.actualRequestedDistinctRegistryItems,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualFulfilledDistinctRegistryItems: 2,
    actualRequestedDistinctRegistryItems: 4,
  },
  output: { result: { observedRatio: 50.0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "marriage/wedding-gift-registry-completion",
  title: "Wedding Gift Registry Completion Calculator",
  description:
    "Actual fulfilled/requested distinct giftregistry item percentage, not spending or duplicate-gift count. Actual independently matched quantities/units required; not infer causal effect, clinical guidance or safe design.",
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
