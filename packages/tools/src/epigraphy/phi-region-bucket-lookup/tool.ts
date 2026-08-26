import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PhiRegionBucketLookupInput = {
  readonly cdNumber: number;
};

export type PhiRegionBucketLookupOutput = {
  readonly bucketStart: number;
  readonly bucketEnd: number;
  readonly bucketLabel: string;
};

export const calculatePhiRegionBucketLookup = (
  input: PhiRegionBucketLookupInput,
): PhiRegionBucketLookupOutput => {
  if (!(input.cdNumber >= 1))
    return simpleError(
      "cdNumber",
      "PHI CD numbers start at 1.",
      "invalid_cd_number",
    );
  const bucketStart = Math.floor(input.cdNumber / 1000) * 1000;
  const bucketEnd = bucketStart + 999;
  return { bucketStart, bucketEnd, bucketLabel: `${bucketStart}-${bucketEnd}` };
};

export const phiRegionBucketLookupExample = {
  input: { cdNumber: 3234 },
  output: { bucketStart: 3000, bucketEnd: 3999, bucketLabel: "3000-3999" },
} satisfies ToolExample<
  PhiRegionBucketLookupInput,
  PhiRegionBucketLookupOutput
>;

export const phiRegionBucketLookupTool = createSimpleTool({
  id: "epigraphy/phi-region-bucket-lookup",
  title: "PHI CD Number Region Bucket Lookup",
  description:
    "Assign a Packhum Inscriptiones CD-ROM number to its thousand-range numeric bucket (a structural grouping aid for batch scans, not a scholarly region attribution).",
  inputs: [
    {
      description: "PHI CD number of the inscription.",
      id: "cdNumber",
      kind: "integer",
      label: "CD number",
      maximum: 999999,
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Inclusive lower bound of the thousand bucket.",
      id: "bucketStart",
      kind: "integer",
      label: "Bucket start",
    },
    {
      description: "Inclusive upper bound of the thousand bucket.",
      id: "bucketEnd",
      kind: "integer",
      label: "Bucket end",
    },
    {
      description: 'Bucket label in the form "<start>-<end>".',
      id: "bucketLabel",
      kind: "string",
      label: "Bucket label",
    },
  ],
  calculate: (input) =>
    calculatePhiRegionBucketLookup(
      input as unknown as PhiRegionBucketLookupInput,
    ),
});

export const runPhiRegionBucketLookup = phiRegionBucketLookupTool.execute;
export default phiRegionBucketLookupTool;
