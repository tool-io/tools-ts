import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ChecksumFixityComparatorInput = {
  readonly expectedChecksum: string;
  readonly actualChecksum: string;
};

export type ChecksumFixityComparatorOutput = {
  readonly match: boolean;
  readonly normalizedExpected: string;
  readonly normalizedActual: string;
};

const normalizeChecksum = (value: string): string => value.trim().toLowerCase();

export const calculateChecksumFixityComparator = (
  input: ChecksumFixityComparatorInput,
): ChecksumFixityComparatorOutput => {
  if (typeof input.expectedChecksum !== "string")
    simpleError(
      "expectedChecksum",
      "Expected checksum must be a string.",
      "invalid_checksum",
    );
  if (typeof input.actualChecksum !== "string")
    simpleError(
      "actualChecksum",
      "Actual checksum must be a string.",
      "invalid_checksum",
    );
  const normalizedExpected = normalizeChecksum(input.expectedChecksum);
  const normalizedActual = normalizeChecksum(input.actualChecksum);
  if (normalizedExpected.length === 0)
    simpleError(
      "expectedChecksum",
      "Expected checksum must not be empty.",
      "invalid_checksum",
    );
  if (normalizedActual.length === 0)
    simpleError(
      "actualChecksum",
      "Actual checksum must not be empty.",
      "invalid_checksum",
    );
  return {
    match: normalizedExpected === normalizedActual,
    normalizedExpected,
    normalizedActual,
  };
};

export const checksumFixityComparatorExample = {
  input: { expectedChecksum: "  ABC123DEF  ", actualChecksum: "abc123def" },
  output: {
    match: true,
    normalizedExpected: "abc123def",
    normalizedActual: "abc123def",
  },
} satisfies ToolExample<
  ChecksumFixityComparatorInput,
  ChecksumFixityComparatorOutput
>;

export const checksumFixityComparatorTool = createSimpleTool({
  id: "archival-studies/checksum-fixity-comparator",
  title: "Checksum Fixity Verification Pass-Fail Comparator",
  description:
    "Verify fixity by comparing expected and actual checksum strings after trimming surrounding whitespace and case-folding both values.",
  inputs: [
    {
      description: "Recorded checksum from the manifest or metadata.",
      id: "expectedChecksum",
      kind: "string",
      label: "Expected",
    },
    {
      description: "Recomputed checksum from the stored file.",
      id: "actualChecksum",
      kind: "string",
      label: "Actual",
    },
  ],
  outputs: [
    {
      description: "True when the normalized checksums agree.",
      id: "match",
      kind: "boolean",
      label: "Match",
    },
    {
      description: "Trimmed lowercase expected checksum.",
      id: "normalizedExpected",
      kind: "string",
      label: "Normalized expected",
    },
    {
      description: "Trimmed lowercase actual checksum.",
      id: "normalizedActual",
      kind: "string",
      label: "Normalized actual",
    },
  ],
  calculate: (input) =>
    calculateChecksumFixityComparator({
      actualChecksum: input.actualChecksum as string,
      expectedChecksum: input.expectedChecksum as string,
    }),
});

export const runChecksumFixityComparator = checksumFixityComparatorTool.execute;
export default checksumFixityComparatorTool;
