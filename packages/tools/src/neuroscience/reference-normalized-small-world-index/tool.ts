import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
  aligned,
  mean,
} from "../shared.js";
export type Input = Readonly<{
  readonly observedClustering: number;
  readonly observedPathLength: number;
  readonly referenceClusterings: readonly number[];
  readonly referencePathLengths: readonly number[];
}>;
export type Output = Readonly<{
  readonly normalizedClustering: number;
  readonly normalizedPathLength: number;
  readonly smallWorldSigma: number;
}>;
const inputFields = [
  { id: "observedClustering", label: "Observed clustering", kind: "number" },
  { id: "observedPathLength", label: "Observed path length", kind: "number" },
  {
    id: "referenceClusterings",
    label: "Reference clusterings",
    kind: "numberList",
  },
  {
    id: "referencePathLengths",
    label: "Reference path lengths",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  fraction(input.observedClustering, "observedClustering");
  positive(input.observedPathLength, "observedPathLength");
  aligned(
    input.referenceClusterings,
    input.referencePathLengths,
    "referenceClusterings",
  );
  input.referenceClusterings.forEach((v) =>
    fraction(v, "referenceClusterings"),
  );
  input.referencePathLengths.forEach((v) =>
    positive(v, "referencePathLengths"),
  );
  const normalizedClustering =
      input.observedClustering /
      positive(mean(input.referenceClusterings), "referenceClusterings"),
    normalizedPathLength =
      input.observedPathLength / mean(input.referencePathLengths);
  return {
    normalizedClustering,
    normalizedPathLength,
    smallWorldSigma: normalizedClustering / normalizedPathLength,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedClustering: 0.6,
  observedPathLength: 2,
  referenceClusterings: [0.2, 0.4],
  referencePathLengths: [1, 3],
} satisfies Input;
export const exampleOutput = {
  normalizedClustering: 2,
  normalizedPathLength: 1,
  smallWorldSigma: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/reference-normalized-small-world-index",
  title: "Small World Index",
  description:
    "Normalize observed clustering and characteristic path length against caller-generated matched reference graphs; no random-graph null or universal small-world label is invented.",
  inputs: inputFields,
  outputs: [
    {
      id: "normalizedClustering",
      label: "Normalized clustering",
      kind: "number",
    },
    {
      id: "normalizedPathLength",
      label: "Normalized path length",
      kind: "number",
    },
    { id: "smallWorldSigma", label: "Small world sigma", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedClustering: value.observedClustering as number,
      observedPathLength: value.observedPathLength as number,
      referenceClusterings: value.referenceClusterings as readonly number[],
      referencePathLengths: value.referencePathLengths as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
