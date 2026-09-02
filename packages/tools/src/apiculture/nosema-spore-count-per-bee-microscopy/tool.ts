import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  integer,
  aligned,
  sum,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedMicroscopySporeCounts: readonly number[];
  readonly observedCountedAliquotFractions: readonly number[];
  readonly independentHomogenizedBeeCount: number;
}>;
export type Output = Readonly<{
  readonly pooledMicroscopySporesPerBee: number;
}>;
const inputFields = [
  {
    id: "observedMicroscopySporeCounts",
    label: "Observed microscopy spore counts",
    kind: "numberList",
  },
  {
    id: "observedCountedAliquotFractions",
    label: "Observed counted aliquot fractions",
    kind: "numberList",
  },
  {
    id: "independentHomogenizedBeeCount",
    label: "Independent homogenized bee count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedCountedAliquotFractions.forEach((v) =>
    positive(v, "observedCountedAliquotFractions"),
  );
  positive(
    input.independentHomogenizedBeeCount,
    "independentHomogenizedBeeCount",
  );
  input.observedMicroscopySporeCounts.forEach((v) =>
    nonnegative(v, "observedMicroscopySporeCounts"),
  );
  aligned(
    input.observedMicroscopySporeCounts,
    input.observedCountedAliquotFractions,
    "observedMicroscopySporeCounts",
  );
  input.observedMicroscopySporeCounts.forEach((v) => integer(v, "spores"));
  integer(input.independentHomogenizedBeeCount, "bees");
  input.observedCountedAliquotFractions.forEach((v) =>
    fraction(v, "disjoint homogenate aliquot"),
  );
  const f = sum(input.observedCountedAliquotFractions);
  fraction(f, "total sampled fraction");
  return {
    pooledMicroscopySporesPerBee:
      sum(input.observedMicroscopySporeCounts) /
      f /
      input.independentHomogenizedBeeCount,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedMicroscopySporeCounts: [10, 20],
  observedCountedAliquotFractions: [0.01, 0.02],
  independentHomogenizedBeeCount: 10,
} satisfies Input;
export const exampleOutput = {
  pooledMicroscopySporesPerBee: 100,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/nosema-spore-count-per-bee-microscopy",
  title: "Nosema Spore Count Per Bee Microscopy Calculator",
  description:
    "Actual disjoint homogenate aliquot microscopy count pooled expansion per independent bee denominator, not Nosema species/colony disease or no-sampling uncertainty claim. Caller independently verifies strain, site, protocol and evidence; not colony-health, treatment, transport-safety or regulatory certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "pooledMicroscopySporesPerBee",
      label: "Pooled microscopy spores per bee",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedMicroscopySporeCounts:
        value.observedMicroscopySporeCounts as readonly number[],
      observedCountedAliquotFractions:
        value.observedCountedAliquotFractions as readonly number[],
      independentHomogenizedBeeCount:
        value.independentHomogenizedBeeCount as number,
    }),
});
export const run = tool.execute;
export default tool;
