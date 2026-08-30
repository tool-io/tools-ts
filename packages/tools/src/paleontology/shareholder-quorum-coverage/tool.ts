import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, fraction, count } from "../shared.js";
export type Input = Readonly<{
  readonly taxonAbundanceCounts: readonly number[];
  readonly taxonDrawOrder: readonly number[];
  readonly targetFrequencyShareQuorum: number;
}>;
export type Output = Readonly<{
  readonly selectedTaxonIndexes: readonly number[];
  readonly accumulatedFrequencyShare: number;
  readonly quorumReached: boolean;
}>;
const inputFields = [
  {
    id: "taxonAbundanceCounts",
    label: "Taxon abundance counts",
    kind: "numberList",
  },
  { id: "taxonDrawOrder", label: "Taxon draw order", kind: "numberList" },
  {
    id: "targetFrequencyShareQuorum",
    label: "Target frequency share quorum",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.targetFrequencyShareQuorum, "targetFrequencyShareQuorum");
  fraction(input.targetFrequencyShareQuorum, "targetFrequencyShareQuorum");
  input.taxonAbundanceCounts.forEach((v) => count(v, "taxonAbundanceCounts"));
  input.taxonDrawOrder.forEach((v) => count(v, "taxonDrawOrder"));
  if (
    !input.taxonAbundanceCounts.length ||
    input.taxonDrawOrder.length !== input.taxonAbundanceCounts.length ||
    new Set(input.taxonDrawOrder).size !== input.taxonDrawOrder.length ||
    input.taxonDrawOrder.some((v) => v >= input.taxonAbundanceCounts.length)
  )
    simpleError(
      "taxonDrawOrder",
      "Full unique zero-based caller draw permutation required.",
    );
  const total = positive(
      input.taxonAbundanceCounts.reduce((a, b) => a + b, 0),
      "taxonAbundanceCounts",
    ),
    selectedTaxonIndexes: number[] = [];
  let share = 0;
  for (const i of input.taxonDrawOrder) {
    if (input.taxonAbundanceCounts[i] === 0) continue;
    selectedTaxonIndexes.push(i);
    share += input.taxonAbundanceCounts[i] / total;
    if (share + 8 * Number.EPSILON >= input.targetFrequencyShareQuorum) break;
  }
  return {
    selectedTaxonIndexes,
    accumulatedFrequencyShare: Math.min(1, share),
    quorumReached:
      share + 8 * Number.EPSILON >= input.targetFrequencyShareQuorum,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  taxonAbundanceCounts: [1, 3, 6],
  taxonDrawOrder: [2, 1, 0],
  targetFrequencyShareQuorum: 0.8,
} satisfies Input;
export const exampleOutput = {
  selectedTaxonIndexes: [2, 1],
  accumulatedFrequencyShare: 0.9,
  quorumReached: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/shareholder-quorum-coverage",
  title: "Shareholder Quorum Subsampling Coverage",
  description:
    "Audit caller taxon draw order to a simple observed-frequency share quorum; explicitly not a full randomized shareholder-quorum subsampling algorithm with dominant-taxon and singleton coverage conventions.",
  inputs: inputFields,
  outputs: [
    {
      id: "selectedTaxonIndexes",
      label: "Selected taxon indexes",
      kind: "numberList",
    },
    {
      id: "accumulatedFrequencyShare",
      label: "Accumulated frequency share",
      kind: "number",
    },
    { id: "quorumReached", label: "Quorum reached", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      taxonAbundanceCounts: value.taxonAbundanceCounts as readonly number[],
      taxonDrawOrder: value.taxonDrawOrder as readonly number[],
      targetFrequencyShareQuorum: value.targetFrequencyShareQuorum as number,
    }),
});
export const run = tool.execute;
export default tool;
