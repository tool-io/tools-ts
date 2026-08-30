import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  count,
  aligned,
  rowInventory,
} from "../shared.js";
export type Input = Readonly<{
  readonly originalShootCountsByVine: readonly number[];
  readonly retainedShootCountsByVine: readonly number[];
  readonly representedVineCounts: readonly number[];
}>;
export type Output = Readonly<{
  readonly perVineShootRemovalPercentages: readonly number[];
  readonly inventoryWeightedShootRemovalPercent: number;
}>;
const inputFields = [
  {
    id: "originalShootCountsByVine",
    label: "Original shoot counts by vine",
    kind: "numberList",
  },
  {
    id: "retainedShootCountsByVine",
    label: "Retained shoot counts by vine",
    kind: "numberList",
  },
  {
    id: "representedVineCounts",
    label: "Represented vine counts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.originalShootCountsByVine.forEach((v) =>
    positive(v, "originalShootCountsByVine"),
  );
  input.representedVineCounts.forEach((v) =>
    positive(v, "representedVineCounts"),
  );
  input.originalShootCountsByVine.forEach((v) =>
    count(v, "originalShootCountsByVine"),
  );
  input.retainedShootCountsByVine.forEach((v) =>
    count(v, "retainedShootCountsByVine"),
  );
  input.representedVineCounts.forEach((v) => count(v, "representedVineCounts"));
  aligned(
    input.originalShootCountsByVine,
    input.retainedShootCountsByVine,
    "originalShootCountsByVine",
  );
  aligned(
    input.originalShootCountsByVine,
    input.representedVineCounts,
    "originalShootCountsByVine",
  );
  if (
    input.retainedShootCountsByVine.some(
      (v, i) => v > input.originalShootCountsByVine[i],
    )
  )
    simpleError(
      "retained",
      "Retained shoots cannot exceed matched original inventory.",
    );
  const removed = input.originalShootCountsByVine.map(
    (v, i) => v - input.retainedShootCountsByVine[i],
  );
  return {
    perVineShootRemovalPercentages: removed.map(
      (v, i) => (100 * v) / input.originalShootCountsByVine[i],
    ),
    inventoryWeightedShootRemovalPercent:
      (100 * rowInventory(removed, input.representedVineCounts)) /
      rowInventory(
        input.originalShootCountsByVine,
        input.representedVineCounts,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  originalShootCountsByVine: [10, 20],
  retainedShootCountsByVine: [5, 15],
  representedVineCounts: [1, 3],
} satisfies Input;
export const exampleOutput = {
  perVineShootRemovalPercentages: [50, 25],
  inventoryWeightedShootRemovalPercent: 28.571428571428573,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/shoot-thinning-percent-removal",
  title: "Shoot Thinning Percent Removal",
  description:
    "Audit matched shoot removal across unequal represented vine cohorts with correct inventory weighting, not averaging percentages or a pruning prescription.",
  inputs: inputFields,
  outputs: [
    {
      id: "perVineShootRemovalPercentages",
      label: "Per vine shoot removal percentages",
      kind: "numberList",
    },
    {
      id: "inventoryWeightedShootRemovalPercent",
      label: "Inventory weighted shoot removal percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      originalShootCountsByVine:
        value.originalShootCountsByVine as readonly number[],
      retainedShootCountsByVine:
        value.retainedShootCountsByVine as readonly number[],
      representedVineCounts: value.representedVineCounts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
