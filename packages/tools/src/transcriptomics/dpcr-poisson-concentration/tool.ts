import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly positivePartitions: number;
  readonly totalPartitions: number;
  readonly partitionVolumeNl: number;
}>;
export type Output = Readonly<{
  readonly positiveFraction: number;
  readonly meanCopiesPerPartition: number;
  readonly copiesPerMicroliter: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.totalPartitions <= 0 ||
    input.positivePartitions < 0 ||
    input.positivePartitions >= input.totalPartitions ||
    input.partitionVolumeNl <= 0
  )
    simpleError(
      "positivePartitions",
      "Positive partitions must be fewer than total and volume positive.",
    );
  const positiveFraction = input.positivePartitions / input.totalPartitions,
    meanCopiesPerPartition = -Math.log1p(-positiveFraction);
  return {
    positiveFraction,
    meanCopiesPerPartition,
    copiesPerMicroliter:
      (meanCopiesPerPartition * 1000) / input.partitionVolumeNl,
  };
};

export const exampleInput = {
  positivePartitions: 500,
  totalPartitions: 1000,
  partitionVolumeNl: 1,
} satisfies Input;
export const exampleOutput = {
  positiveFraction: 0.5,
  meanCopiesPerPartition: 0.6931471805599453,
  copiesPerMicroliter: 693.1471805599452,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/dpcr-poisson-concentration",
  title: "DPCR Poisson Concentration",
  description:
    "Convert digital-PCR positive partition fraction to Poisson-corrected concentration.",
  inputs: [
    { id: "positivePartitions", kind: "number", label: "Positive partitions" },
    { id: "totalPartitions", kind: "number", label: "Total partitions" },
    { id: "partitionVolumeNl", kind: "number", label: "Partition volume nl" },
  ],
  outputs: [
    { id: "positiveFraction", kind: "number", label: "Positive fraction" },
    {
      id: "meanCopiesPerPartition",
      kind: "number",
      label: "Mean copies per partition",
    },
    {
      id: "copiesPerMicroliter",
      kind: "number",
      label: "Copies per microliter",
    },
  ],
  calculate: (value) =>
    calculate({
      positivePartitions: value.positivePartitions as number,
      totalPartitions: value.totalPartitions as number,
      partitionVolumeNl: value.partitionVolumeNl as number,
    }),
});
export const run = tool.execute;
export default tool;
