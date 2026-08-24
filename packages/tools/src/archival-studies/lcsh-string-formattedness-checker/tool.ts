import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LcshStringFormattednessCheckerInput = {
  readonly heading: string;
};

export type LcshStringFormattednessCheckerOutput = {
  readonly wellFormed: boolean;
  readonly issues: readonly string[];
  readonly subdivisionCount: number;
};

export const calculateLcshStringFormattednessChecker = (
  input: LcshStringFormattednessCheckerInput,
): LcshStringFormattednessCheckerOutput => {
  const raw = input.heading;
  if (raw.trim().length === 0)
    simpleError("heading", "Heading must not be empty.", "invalid_heading");
  const issues: string[] = [];
  if (raw !== raw.trim()) issues.push("extraneous whitespace");
  if (/--\s|\s--/.test(raw)) issues.push("space adjacent to double hyphen");
  if (/[–—]/.test(raw)) issues.push("en or em dash used as separator");
  const segments = raw.split("--").map((segment) => segment.trim());
  for (const segment of segments) {
    if (segment.length === 0) issues.push("empty subdivision");
    else if (!/^[A-Z"'(]/.test(segment))
      issues.push(`subdivision not capitalized: ${segment}`);
  }
  return {
    wellFormed: issues.length === 0,
    issues,
    subdivisionCount: Math.max(0, segments.length - 1),
  };
};

export const lcshStringFormattednessCheckerExample = {
  input: { heading: "World War, 1939-1945--Campaigns--France" },
  output: { wellFormed: true, issues: [], subdivisionCount: 2 },
} satisfies ToolExample<
  LcshStringFormattednessCheckerInput,
  LcshStringFormattednessCheckerOutput
>;

export const lcshStringFormattednessCheckerTool = createSimpleTool({
  id: "archival-studies/lcsh-string-formattedness-checker",
  title: "LCSH Subject Heading String Well-Formedness Checker",
  description:
    "Check an LCSH-style heading string for double-hyphen subdivision separators, capitalization of each segment and absence of stray dashes or padding.",
  inputs: [
    {
      description: "Subject heading string with '--' subdivisions.",
      id: "heading",
      kind: "string",
      label: "Heading",
    },
  ],
  outputs: [
    {
      description: "True when no formatting issues were found.",
      id: "wellFormed",
      kind: "boolean",
      label: "Well formed",
    },
    {
      description: "Formatting issues detected, in check order.",
      id: "issues",
      kind: "stringList",
      label: "Issues",
    },
    {
      description:
        "Number of subdivisions after the main heading; the main heading itself is not counted.",
      id: "subdivisionCount",
      kind: "integer",
      label: "Subdivisions",
    },
  ],
  calculate: (input) =>
    calculateLcshStringFormattednessChecker({
      heading: input.heading as string,
    }),
});

export const runLcshStringFormattednessChecker =
  lcshStringFormattednessCheckerTool.execute;
export default lcshStringFormattednessCheckerTool;
