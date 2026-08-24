import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RepositoryMarcOrgCodeCheckerInput = {
  readonly code: string;
};

export type RepositoryMarcOrgCodeCheckerOutput = {
  readonly isValid: boolean;
  readonly normalizedCode: string;
  readonly issues: readonly string[];
};

const MAX_LENGTH = 16;
const BODY = /^[A-Za-z0-9]+(-[A-Za-z0-9]+)*$/;

export const calculateRepositoryMarcOrgCodeChecker = (
  input: RepositoryMarcOrgCodeCheckerInput,
): RepositoryMarcOrgCodeCheckerOutput => {
  const normalizedCode = input.code.trim();
  if (normalizedCode.length === 0)
    simpleError("code", "Code must not be empty.", "invalid_code");
  const issues: string[] = [];
  if (normalizedCode.length > MAX_LENGTH)
    issues.push(`longer than ${MAX_LENGTH} characters`);
  if (!BODY.test(normalizedCode))
    issues.push("must be letters and digits with single interior hyphens only");
  else if (!/[A-Za-z]/.test(normalizedCode))
    issues.push("must contain at least one letter");
  return { isValid: issues.length === 0, normalizedCode, issues };
};

export const repositoryMarcOrgCodeCheckerExample = {
  input: { code: "CSt-H" },
  output: { isValid: true, normalizedCode: "CSt-H", issues: [] },
} satisfies ToolExample<
  RepositoryMarcOrgCodeCheckerInput,
  RepositoryMarcOrgCodeCheckerOutput
>;

export const repositoryMarcOrgCodeCheckerTool = createSimpleTool({
  id: "archival-studies/repository-marc-org-code-checker",
  title: "Repository Code MARC Organization Identifier Format Checker",
  description:
    "Check a MARC organization code format of up to 16 letters, digits and single interior hyphens with at least one letter, preserving the original case.",
  inputs: [
    {
      description: "Candidate MARC organization code.",
      id: "code",
      kind: "string",
      label: "Code",
    },
  ],
  outputs: [
    {
      description: "True when the code satisfies the format rules.",
      id: "isValid",
      kind: "boolean",
      label: "Valid",
    },
    {
      description: "Trimmed code in its original case.",
      id: "normalizedCode",
      kind: "string",
      label: "Normalized",
    },
    {
      description: "Format violations found; empty when valid.",
      id: "issues",
      kind: "stringList",
      label: "Issues",
    },
  ],
  calculate: (input) =>
    calculateRepositoryMarcOrgCodeChecker({
      code: input.code as string,
    }),
});

export const runRepositoryMarcOrgCodeChecker =
  repositoryMarcOrgCodeCheckerTool.execute;
export default repositoryMarcOrgCodeCheckerTool;
