import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DiskImageTbAggregatorInput = {
  readonly sizesTb: readonly number[];
};

export type DiskImageTbAggregatorOutput = {
  readonly imageCount: number;
  readonly totalTb: number;
  readonly averageTb: number;
};

export const calculateDiskImageTbAggregator = (
  input: DiskImageTbAggregatorInput,
): DiskImageTbAggregatorOutput => {
  const sizes = input.sizesTb;
  if (!Array.isArray(sizes) || sizes.length === 0)
    simpleError(
      "sizesTb",
      "At least one disk image size is required.",
      "invalid_sizes",
    );
  for (let i = 0; i < sizes.length; i += 1) {
    const s = (sizes as readonly number[])[i] as number;
    if (!Number.isFinite(s) || s < 0)
      simpleError(
        "sizesTb",
        "Disk image sizes must be finite numbers at least 0 TB.",
        "invalid_sizes",
      );
  }
  let totalTb = 0;
  for (const s of sizes as readonly number[]) totalTb += s;
  if (!Number.isFinite(totalTb))
    simpleError("sizesTb", "Total overflowed.", "numeric_overflow");
  const averageTb = totalTb / sizes.length;
  if (!Number.isFinite(averageTb))
    simpleError(
      "sizesTb",
      "Average could not be calculated.",
      "numeric_overflow",
    );
  return {
    imageCount: sizes.length,
    totalTb: totalTb === 0 ? 0 : totalTb,
    averageTb: averageTb === 0 ? 0 : averageTb,
  };
};

export const diskImageTbAggregatorExample = {
  input: { sizesTb: [1.5, 2.25, 0.75] },
  output: { imageCount: 3, totalTb: 4.5, averageTb: 1.5 },
} satisfies ToolExample<
  DiskImageTbAggregatorInput,
  DiskImageTbAggregatorOutput
>;

export const diskImageTbAggregatorTool = createSimpleTool({
  id: "archival-studies/disk-image-tb-aggregator",
  title: "Born-Digital Disk Image Size TB Aggregator",
  description:
    "Aggregate born-digital disk image accession sizes in terabytes into a count, storage total and mean image footprint.",
  inputs: [
    {
      description: "Disk image sizes in terabytes.",
      id: "sizesTb",
      kind: "numberList",
      label: "Sizes (TB)",
    },
  ],
  outputs: [
    {
      description: "Number of disk images aggregated.",
      id: "imageCount",
      kind: "integer",
      label: "Image count",
    },
    {
      description: "Combined storage footprint in terabytes.",
      id: "totalTb",
      kind: "number",
      label: "Total TB",
    },
    {
      description: "Mean disk image size in terabytes.",
      id: "averageTb",
      kind: "number",
      label: "Average TB",
    },
  ],
  calculate: (input) =>
    calculateDiskImageTbAggregator({
      sizesTb: input.sizesTb as readonly number[],
    }),
});

export const runDiskImageTbAggregator = diskImageTbAggregatorTool.execute;
export default diskImageTbAggregatorTool;
