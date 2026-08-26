import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ParquetExpansionGapInput = {
  readonly roomLengthM: number;
};

export type ParquetExpansionGapOutput = {
  readonly recommendedGapMm: number;
};

export const parquetExpansionGapExample = {
  input: { roomLengthM: 12 },
  output: { recommendedGapMm: 15 },
} satisfies ToolExample<ParquetExpansionGapInput, ParquetExpansionGapOutput>;

export const parquetExpansionGapTool = createSimpleTool({
  id: "carpentry/parkett-dehnungsfuge-10-15mm",
  title: "Parquet Expansion Gap Rule",
  description:
    "Recommend the parquet expansion gap as 10 mm below 10 m and 15 mm from 10 m room length.",
  inputs: [
    {
      description: "Room length along the parquet field in meters.",
      id: "roomLengthM",
      kind: "number",
      label: "Room length",
      maximum: 30,
      unit: "m",
    },
  ],
  outputs: [
    {
      description: "Recommended expansion gap in millimeters.",
      id: "recommendedGapMm",
      kind: "number",
      label: "Recommended gap",
      unit: "mm",
    },
  ],
  calculate: (input) => {
    const roomLengthM = input.roomLengthM as number;
    if (roomLengthM <= 0)
      simpleError(
        "roomLengthM",
        "The room length must be greater than zero.",
        "must_be_positive",
      );
    return {
      recommendedGapMm: roomLengthM < 10 ? 10 : 15,
    };
  },
});
export const runParquetExpansionGap = parquetExpansionGapTool.execute;
export default parquetExpansionGapTool;
