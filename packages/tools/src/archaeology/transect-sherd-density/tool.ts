import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
  count,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly transectLengthsM: readonly number[];
  readonly effectiveCollectionWidthsM: readonly number[];
  readonly sherdCounts: readonly number[];
  readonly detectionProbabilities: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedSherdsPerM2: readonly number[];
  readonly detectionAdjustedPooledSherdsPerM2: number;
}>;
const inputFields = [
  { id: "transectLengthsM", label: "Transect lengths m", kind: "numberList" },
  {
    id: "effectiveCollectionWidthsM",
    label: "Effective collection widths m",
    kind: "numberList",
  },
  { id: "sherdCounts", label: "Sherd counts", kind: "numberList" },
  {
    id: "detectionProbabilities",
    label: "Detection probabilities",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.transectLengthsM.forEach((v) => positive(v, "transectLengthsM"));
  input.effectiveCollectionWidthsM.forEach((v) =>
    positive(v, "effectiveCollectionWidthsM"),
  );
  input.detectionProbabilities.forEach((v) =>
    positive(v, "detectionProbabilities"),
  );
  input.detectionProbabilities.forEach((v) =>
    fraction(v, "detectionProbabilities"),
  );
  input.sherdCounts.forEach((v) => count(v, "sherdCounts"));
  aligned(
    input.transectLengthsM,
    input.effectiveCollectionWidthsM,
    "transectLengthsM",
  );
  aligned(input.transectLengthsM, input.sherdCounts, "transectLengthsM");
  aligned(
    input.transectLengthsM,
    input.detectionProbabilities,
    "transectLengthsM",
  );
  const areas = input.transectLengthsM.map(
    (l, i) => l * input.effectiveCollectionWidthsM[i],
  );
  return {
    observedSherdsPerM2: input.sherdCounts.map((v, i) => v / areas[i]),
    detectionAdjustedPooledSherdsPerM2:
      input.sherdCounts.reduce(
        (s, v, i) => s + v / input.detectionProbabilities[i],
        0,
      ) / areas.reduce((a, b) => a + b, 0),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  transectLengthsM: [10, 20],
  effectiveCollectionWidthsM: [2, 1],
  sherdCounts: [10, 30],
  detectionProbabilities: [0.5, 1],
} satisfies Input;
export const exampleOutput = {
  observedSherdsPerM2: [0.5, 1.5],
  detectionAdjustedPooledSherdsPerM2: 1.25,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/transect-sherd-density",
  title: "Transect Sherd Density",
  description:
    "Aggregate strip-collected sherd density with caller detection probabilities, using physical exposure areas rather than averaging unequal transects; detection correction is a model, not total site inventory.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedSherdsPerM2",
      label: "Observed sherds per m2",
      kind: "numberList",
    },
    {
      id: "detectionAdjustedPooledSherdsPerM2",
      label: "Detection adjusted pooled sherds per m2",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      transectLengthsM: value.transectLengthsM as readonly number[],
      effectiveCollectionWidthsM:
        value.effectiveCollectionWidthsM as readonly number[],
      sherdCounts: value.sherdCounts as readonly number[],
      detectionProbabilities: value.detectionProbabilities as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
