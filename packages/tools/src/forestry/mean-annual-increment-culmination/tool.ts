import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
  aligned,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualInventoryAgesYears: readonly number[];
  readonly actualInventoryStandingVolumes: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualInventoryAgesYears",
    label: "Actual inventory ages years",
    kind: "numberList",
  },
  {
    id: "actualInventoryStandingVolumes",
    label: "Actual inventory standing volumes",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.actualInventoryAgesYears,
    input.actualInventoryStandingVolumes,
    "inventory",
  );
  input.actualInventoryAgesYears.forEach((v, i) => {
    positive(v, "age");
    nonnegative(input.actualInventoryStandingVolumes[i], "volume");
    if (i && v <= input.actualInventoryAgesYears[i - 1])
      simpleError("ages", "Increasingactualinventoryages.");
  });
  const a = input.actualInventoryAgesYears.map(
      (v, i) => input.actualInventoryStandingVolumes[i] / v,
    ),
    m = Math.max(...a);
  return {
    observedMaiMaximizingAgesYears: input.actualInventoryAgesYears.filter(
      (_, i) => a[i] === m,
    ),
    observedMaximumMai: m,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualInventoryAgesYears: [10, 20, 30],
    actualInventoryStandingVolumes: [20, 60, 60],
  },
  output: {
    result: { observedMaiMaximizingAgesYears: [20], observedMaximumMai: 3 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/mean-annual-increment-culmination",
  title: "MAI Culmination Calculator",
  description:
    "Observed MAI culmination among actual age/volume inventory points, ties retained; not continuous optimum rotation forecast or species yield curve.",
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
