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
  fraction,
  count,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly miteCounts: readonly number[];
  readonly washedBeeCounts: readonly number[];
  readonly washRecoveryFractionBounds: readonly number[];
}>;
export type Output = Readonly<{
  readonly sampleMitesPer100Bees: readonly number[];
  readonly pooledObservedMitesPer100Bees: number;
  readonly recoveryAdjustedRateBounds: readonly number[];
}>;
const inputFields = [
  { id: "miteCounts", label: "Mite counts", kind: "numberList" },
  { id: "washedBeeCounts", label: "Washed bee counts", kind: "numberList" },
  {
    id: "washRecoveryFractionBounds",
    label: "Wash recovery fraction bounds",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.washedBeeCounts.forEach((v) => positive(v, "washedBeeCounts"));
  input.washRecoveryFractionBounds.forEach((v) =>
    positive(v, "washRecoveryFractionBounds"),
  );
  input.washRecoveryFractionBounds.forEach((v) =>
    fraction(v, "washRecoveryFractionBounds"),
  );
  input.miteCounts.forEach((v) => count(v, "miteCounts"));
  input.washedBeeCounts.forEach((v) => count(v, "washedBeeCounts"));
  aligned(input.miteCounts, input.washedBeeCounts, "miteCounts");
  if (
    input.washRecoveryFractionBounds.length !== 2 ||
    input.washRecoveryFractionBounds[0] > input.washRecoveryFractionBounds[1]
  )
    simpleError(
      "washRecoveryFractionBounds",
      "Ordered two-bound recovery calibration required.",
    );
  const pooledObservedMitesPer100Bees =
    (100 * input.miteCounts.reduce((a, b) => a + b, 0)) /
    input.washedBeeCounts.reduce((a, b) => a + b, 0);
  return {
    sampleMitesPer100Bees: input.miteCounts.map(
      (v, i) => (100 * v) / input.washedBeeCounts[i],
    ),
    pooledObservedMitesPer100Bees,
    recoveryAdjustedRateBounds: [
      pooledObservedMitesPer100Bees / input.washRecoveryFractionBounds[1],
      pooledObservedMitesPer100Bees / input.washRecoveryFractionBounds[0],
    ],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  miteCounts: [3, 6],
  washedBeeCounts: [100, 200],
  washRecoveryFractionBounds: [0.5, 1],
} satisfies Input;
export const exampleOutput = {
  sampleMitesPer100Bees: [3, 3],
  pooledObservedMitesPer100Bees: 3,
  recoveryAdjustedRateBounds: [3, 6],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/varroa-infestation-percent-alcohol-wash",
  title: "Varroa Infestation Percent Alcohol Wash",
  description:
    "Compute pooled wash mite count per 100 bees with caller recovery-calibration bounds; multiple mites per host are allowed, so this is not a binomial host-infection probability or treatment threshold.",
  inputs: inputFields,
  outputs: [
    {
      id: "sampleMitesPer100Bees",
      label: "Sample mites per100 bees",
      kind: "numberList",
    },
    {
      id: "pooledObservedMitesPer100Bees",
      label: "Pooled observed mites per100 bees",
      kind: "number",
    },
    {
      id: "recoveryAdjustedRateBounds",
      label: "Recovery adjusted rate bounds",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      miteCounts: value.miteCounts as readonly number[],
      washedBeeCounts: value.washedBeeCounts as readonly number[],
      washRecoveryFractionBounds:
        value.washRecoveryFractionBounds as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
