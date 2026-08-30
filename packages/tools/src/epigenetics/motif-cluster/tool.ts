import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly motifPositionsBp: readonly number[];
  readonly maximumGapBp: number;
  readonly minimumClusterSize: number;
}>;
export type Output = Readonly<{
  readonly clusterCount: number;
  readonly largestClusterSize: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.motifPositionsBp.length === 0 ||
    input.motifPositionsBp.some(
      (v, i) => i > 0 && v < input.motifPositionsBp[i - 1],
    )
  )
    simpleError(
      "motifPositionsBp",
      "Positions must be sorted and nonempty.",
      "invalid_positions",
    );
  const sizes: number[] = [];
  let size = 1;
  for (let i = 1; i < input.motifPositionsBp.length; i += 1) {
    if (
      input.motifPositionsBp[i] - input.motifPositionsBp[i - 1] <=
      input.maximumGapBp
    )
      size += 1;
    else {
      sizes.push(size);
      size = 1;
    }
  }
  sizes.push(size);
  const kept = sizes.filter((v) => v >= input.minimumClusterSize);
  return {
    clusterCount: kept.length,
    largestClusterSize: kept.length ? Math.max(...kept) : 0,
  };
};

export const exampleInput = {
  motifPositionsBp: [10, 20, 100, 105, 110],
  maximumGapBp: 15,
  minimumClusterSize: 2,
} satisfies Input;
export const exampleOutput = {
  clusterCount: 2,
  largestClusterSize: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      motifPositionsBp: input.motifPositionsBp as readonly number[],
      maximumGapBp: input.maximumGapBp as number,
      minimumClusterSize: input.minimumClusterSize as number,
    }),
  description: "Count motif clusters using a maximum spacing.",
  id: "epigenetics/motif-cluster",
  inputs: [
    { id: "motifPositionsBp", label: "Motif positions", kind: "numberList" },
    {
      id: "maximumGapBp",
      label: "Maximum cluster gap",
      kind: "number",
      minimum: 0,
    },
    {
      id: "minimumClusterSize",
      label: "Minimum cluster size",
      kind: "integer",
      minimum: 1,
    },
  ],
  outputs: [
    { id: "clusterCount", label: "Cluster count", kind: "integer", minimum: 0 },
    {
      id: "largestClusterSize",
      label: "Largest cluster size",
      kind: "integer",
      minimum: 0,
    },
  ],
  title: "Motif Cluster",
});

export const run = tool.execute;
export default tool;
