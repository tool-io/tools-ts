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
  nonnegative,
  fraction,
  count,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly seedSubsampleMassesGrams: readonly number[];
  readonly seedSubsampleCounts: readonly number[];
  readonly observedMoistureFractions: readonly number[];
  readonly reportingMoistureFraction: number;
}>;
export type Output = Readonly<{
  readonly pooledObservedThousandSeedMassGrams: number;
  readonly pooledMoistureStandardizedThousandSeedMassGrams: number;
}>;
const inputFields = [
  {
    id: "seedSubsampleMassesGrams",
    label: "Seed subsample masses grams",
    kind: "numberList",
  },
  {
    id: "seedSubsampleCounts",
    label: "Seed subsample counts",
    kind: "numberList",
  },
  {
    id: "observedMoistureFractions",
    label: "Observed moisture fractions",
    kind: "numberList",
  },
  {
    id: "reportingMoistureFraction",
    label: "Reporting moisture fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.seedSubsampleCounts.forEach((v) => positive(v, "seedSubsampleCounts"));
  input.seedSubsampleMassesGrams.forEach((v) =>
    nonnegative(v, "seedSubsampleMassesGrams"),
  );
  input.observedMoistureFractions.forEach((v) =>
    fraction(v, "observedMoistureFractions"),
  );
  fraction(input.reportingMoistureFraction, "reportingMoistureFraction");
  input.seedSubsampleCounts.forEach((v) => count(v, "seedSubsampleCounts"));
  aligned(
    input.seedSubsampleMassesGrams,
    input.seedSubsampleCounts,
    "seedSubsampleMassesGrams",
  );
  aligned(
    input.seedSubsampleMassesGrams,
    input.observedMoistureFractions,
    "seedSubsampleMassesGrams",
  );
  if (
    input.reportingMoistureFraction === 1 ||
    input.observedMoistureFractions.some((v) => v === 1)
  )
    simpleError("moisture", "Seed moisture below one required.");
  const n = input.seedSubsampleCounts.reduce((a, b) => a + b, 0);
  return {
    pooledObservedThousandSeedMassGrams:
      (1000 * input.seedSubsampleMassesGrams.reduce((a, b) => a + b, 0)) / n,
    pooledMoistureStandardizedThousandSeedMassGrams:
      (1000 *
        input.seedSubsampleMassesGrams.reduce(
          (s, v, i) =>
            s +
            (v * (1 - input.observedMoistureFractions[i])) /
              (1 - input.reportingMoistureFraction),
          0,
        )) /
      n,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  seedSubsampleMassesGrams: [1, 3],
  seedSubsampleCounts: [100, 200],
  observedMoistureFractions: [0.1, 0.2],
  reportingMoistureFraction: 0.1,
} satisfies Input;
export const exampleOutput = {
  pooledObservedThousandSeedMassGrams: 13.333333333333334,
  pooledMoistureStandardizedThousandSeedMassGrams: 12.222222222222221,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/thousand-seed-weight",
  title: "Agriculture Thousand Seed Weight",
  description:
    "Pool unequal counted seed subsamples and conserve dry matter to a caller reporting moisture basis; unlike a fixed unit weight, differing sample counts/moisture are explicit.",
  inputs: inputFields,
  outputs: [
    {
      id: "pooledObservedThousandSeedMassGrams",
      label: "Pooled observed thousand seed mass grams",
      kind: "number",
    },
    {
      id: "pooledMoistureStandardizedThousandSeedMassGrams",
      label: "Pooled moisture standardized thousand seed mass grams",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      seedSubsampleMassesGrams:
        value.seedSubsampleMassesGrams as readonly number[],
      seedSubsampleCounts: value.seedSubsampleCounts as readonly number[],
      observedMoistureFractions:
        value.observedMoistureFractions as readonly number[],
      reportingMoistureFraction: value.reportingMoistureFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
