import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RpaAuditTrailInput = {
  readonly automationName: string;
  readonly changeApprovalId: string;
  readonly exceptionHandlingTested: boolean;
  readonly executionLogsComplete: boolean;
  readonly lastRunDate: string;
  readonly outputReviewEvidence: boolean;
  readonly version: string;
};

export type RpaAuditTrailOutput = {
  readonly evidenceReady: boolean;
  readonly issueCount: number;
  readonly issues: ReadonlyArray<string>;
};

export const assessRpaAuditTrailEvidence = (
  input: RpaAuditTrailInput,
): RpaAuditTrailOutput => {
  for (const [field, value] of [
    ["automationName", input.automationName],
    ["changeApprovalId", input.changeApprovalId],
    ["lastRunDate", input.lastRunDate],
    ["version", input.version],
  ] as const)
    if (typeof value !== "string" || value.trim() === "")
      simpleError(
        field,
        `${field} must be a nonempty string.`,
        "rpa_field_required",
      );
  for (const field of [
    "exceptionHandlingTested",
    "executionLogsComplete",
    "outputReviewEvidence",
  ] as const)
    if (typeof input[field] !== "boolean")
      simpleError(
        field,
        `${field} must be a boolean.`,
        "boolean_field_required",
      );
  const issues: string[] = [];
  if (!input.executionLogsComplete) issues.push("execution_logs_incomplete");
  if (!input.outputReviewEvidence) issues.push("output_review_missing");
  if (!input.exceptionHandlingTested)
    issues.push("exception_handling_not_tested");
  return {
    evidenceReady: issues.length === 0,
    issueCount: issues.length,
    issues,
  };
};

export const rpaAuditTrailExample = {
  input: {
    automationName: "Daily AP Invoice Posting",
    changeApprovalId: "CHG-2041",
    exceptionHandlingTested: true,
    executionLogsComplete: true,
    lastRunDate: "2026-09-23",
    outputReviewEvidence: false,
    version: "3.2.1",
  },
  output: {
    evidenceReady: false,
    issueCount: 1,
    issues: ["output_review_missing"],
  },
} satisfies ToolExample<RpaAuditTrailInput, RpaAuditTrailOutput>;

export const rpaAuditTrailTool = createSimpleTool({
  calculate: (input) =>
    assessRpaAuditTrailEvidence({
      automationName: input.automationName as string,
      changeApprovalId: input.changeApprovalId as string,
      exceptionHandlingTested: input.exceptionHandlingTested as boolean,
      executionLogsComplete: input.executionLogsComplete as boolean,
      lastRunDate: input.lastRunDate as string,
      outputReviewEvidence: input.outputReviewEvidence as boolean,
      version: input.version as string,
    }),
  description:
    "Check supplied RPA identification, change, run, output-review, and exception-testing evidence for audit-trail readiness.",
  id: "auditing/rpa-bot-audit-trail-versioning-evidence-lookup",
  inputs: [
    { id: "automationName", kind: "string", label: "Automation name" },
    { id: "changeApprovalId", kind: "string", label: "Change approval ID" },
    {
      id: "exceptionHandlingTested",
      kind: "boolean",
      label: "Exception handling tested",
    },
    {
      id: "executionLogsComplete",
      kind: "boolean",
      label: "Execution logs complete",
    },
    { id: "lastRunDate", kind: "string", label: "Last run date" },
    {
      id: "outputReviewEvidence",
      kind: "boolean",
      label: "Output review evidence",
    },
    { id: "version", kind: "string", label: "Automation version" },
  ],
  outputs: [
    {
      id: "evidenceReady",
      kind: "boolean",
      label: "Audit-trail evidence ready",
    },
    { id: "issueCount", kind: "integer", label: "Evidence issues", minimum: 0 },
    { id: "issues", kind: "stringList", label: "Issue labels" },
  ],
  title: "RPA Bot Audit Trail Versioning Evidence Lookup",
});

export const runRpaAuditTrail = rpaAuditTrailTool.execute;
export default rpaAuditTrailTool;
