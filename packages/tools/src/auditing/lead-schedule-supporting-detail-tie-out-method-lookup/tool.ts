import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LeadScheduleTieOutInput = {
  readonly detailTotal: number;
  readonly leadBalance: number;
  readonly tolerance: number;
};

export type LeadScheduleTieOutOutput = {
  readonly difference: number;
  readonly status: "reconciled" | "difference";
  readonly withinTolerance: boolean;
};

export const tieOutLeadSchedule = (
  input: LeadScheduleTieOutInput,
): LeadScheduleTieOutOutput => {
  for (const field of ["detailTotal", "leadBalance", "tolerance"] as const)
    if (!Number.isFinite(input[field]))
      simpleError(field, `${field} must be finite.`, "finite_value_required");
  if (input.tolerance < 0)
    simpleError(
      "tolerance",
      "Tolerance must be nonnegative.",
      "invalid_tolerance",
    );
  const difference = input.leadBalance - input.detailTotal;
  if (!Number.isFinite(difference))
    simpleError(
      "leadBalance",
      "The tie-out difference is not finite.",
      "result_not_finite",
    );
  const normalizedDifference = difference === 0 ? 0 : difference;
  const withinTolerance = Math.abs(difference) <= input.tolerance;
  return {
    difference: normalizedDifference,
    status: withinTolerance ? "reconciled" : "difference",
    withinTolerance,
  };
};

export const leadScheduleTieOutExample = {
  input: { detailTotal: 1_249_500, leadBalance: 1_250_000, tolerance: 1_000 },
  output: { difference: 500, status: "reconciled", withinTolerance: true },
} satisfies ToolExample<LeadScheduleTieOutInput, LeadScheduleTieOutOutput>;

export const leadScheduleTieOutTool = createSimpleTool({
  calculate: (input) =>
    tieOutLeadSchedule({
      detailTotal: input.detailTotal as number,
      leadBalance: input.leadBalance as number,
      tolerance: input.tolerance as number,
    }),
  description:
    "Tie a lead-schedule balance to a supplied supporting-detail total and report the signed difference against an explicit tolerance.",
  id: "auditing/lead-schedule-supporting-detail-tie-out-method-lookup",
  inputs: [
    { id: "detailTotal", kind: "number", label: "Supporting detail total" },
    { id: "leadBalance", kind: "number", label: "Lead schedule balance" },
    {
      description: "Maximum permitted absolute tie-out difference.",
      id: "tolerance",
      kind: "number",
      label: "Tolerance",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "difference", kind: "number", label: "Lead minus detail" },
    {
      enum: ["difference", "reconciled"],
      id: "status",
      kind: "string",
      label: "Tie-out status",
    },
    { id: "withinTolerance", kind: "boolean", label: "Within tolerance" },
  ],
  title: "Lead Schedule Supporting Detail Tie-Out Method Lookup",
});

export const runLeadScheduleTieOut = leadScheduleTieOutTool.execute;
export default leadScheduleTieOutTool;
