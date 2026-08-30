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
  count,
  aligned,
  ids,
} from "../shared.js";
export type Input = Readonly<{
  readonly toothIds: readonly number[];
  readonly observableCrownLengthsMm: readonly number[];
  readonly identifiedBandCounts: readonly number[];
}>;
export type Output = Readonly<{
  readonly totalIdentifiedBands: number;
  readonly assessableToothCount: number;
  readonly bandsPerAssessableTooth: number;
  readonly pooledBandsPerObservableMm: number;
}>;
const inputFields = [
  { id: "toothIds", label: "Tooth ids", kind: "numberList" },
  {
    id: "observableCrownLengthsMm",
    label: "Observable crown lengths mm",
    kind: "numberList",
  },
  {
    id: "identifiedBandCounts",
    label: "Identified band counts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observableCrownLengthsMm.forEach((v) =>
    nonnegative(v, "observableCrownLengthsMm"),
  );
  input.identifiedBandCounts.forEach((v) => count(v, "identifiedBandCounts"));
  aligned(input.toothIds, input.observableCrownLengthsMm, "toothIds");
  aligned(input.toothIds, input.identifiedBandCounts, "toothIds");
  ids(input.toothIds, "toothIds");
  if (
    input.observableCrownLengthsMm.some(
      (v, i) => v === 0 && input.identifiedBandCounts[i] > 0,
    )
  )
    simpleError(
      "identifiedBandCounts",
      "Unobservable teeth cannot have observed band counts.",
    );
  const totalIdentifiedBands = input.identifiedBandCounts.reduce(
      (a, b) => a + b,
      0,
    ),
    assessableToothCount = positive(
      input.observableCrownLengthsMm.filter((v) => v > 0).length,
      "observableCrownLengthsMm",
    );
  return {
    totalIdentifiedBands,
    assessableToothCount,
    bandsPerAssessableTooth: totalIdentifiedBands / assessableToothCount,
    pooledBandsPerObservableMm:
      totalIdentifiedBands /
      input.observableCrownLengthsMm.reduce((a, b) => a + b, 0),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  toothIds: [1, 2, 3],
  observableCrownLengthsMm: [10, 0, 20],
  identifiedBandCounts: [2, 0, 1],
} satisfies Input;
export const exampleOutput = {
  totalIdentifiedBands: 3,
  assessableToothCount: 2,
  bandsPerAssessableTooth: 1.5,
  pooledBandsPerObservableMm: 0.1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/enamel-hypoplasia-band-count",
  title: "Enamel Hypoplasia Band Count Tool",
  description:
    "Tabulate independently identified enamel bands with tooth observability and crown-length exposure; multiple teeth may record the same episode and counts are not distinct stress events or diagnoses.",
  inputs: inputFields,
  outputs: [
    {
      id: "totalIdentifiedBands",
      label: "Total identified bands",
      kind: "number",
    },
    {
      id: "assessableToothCount",
      label: "Assessable tooth count",
      kind: "number",
    },
    {
      id: "bandsPerAssessableTooth",
      label: "Bands per assessable tooth",
      kind: "number",
    },
    {
      id: "pooledBandsPerObservableMm",
      label: "Pooled bands per observable mm",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      toothIds: value.toothIds as readonly number[],
      observableCrownLengthsMm:
        value.observableCrownLengthsMm as readonly number[],
      identifiedBandCounts: value.identifiedBandCounts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
