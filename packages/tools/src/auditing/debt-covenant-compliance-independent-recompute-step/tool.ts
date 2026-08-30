import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DebtCovenantRecomputeInput = {
  readonly covenantLimit: number;
  readonly reportedDenominator: number;
  readonly reportedNumerator: number;
  readonly sourceDenominator: number;
  readonly sourceNumerator: number;
  readonly tolerance: number;
};

export type DebtCovenantRecomputeOutput = {
  readonly compliant: boolean;
  readonly recomputedRatio: number;
  readonly reportedRatio: number;
  readonly ratioDifference: number;
};

export const recomputeDebtCovenantCompliance = (
  input: DebtCovenantRecomputeInput,
): DebtCovenantRecomputeOutput => {
  for (const [field, value] of [
    ["covenantLimit", input.covenantLimit],
    ["reportedDenominator", input.reportedDenominator],
    ["reportedNumerator", input.reportedNumerator],
    ["sourceDenominator", input.sourceDenominator],
    ["sourceNumerator", input.sourceNumerator],
    ["tolerance", input.tolerance],
  ] as const)
    if (!Number.isFinite(value))
      simpleError(field, `${field} must be finite.`, "finite_value_required");
  if (input.reportedDenominator === 0 || input.sourceDenominator === 0)
    simpleError(
      "",
      "Reported and source denominators must be nonzero.",
      "zero_covenant_denominator",
    );
  if (input.tolerance < 0)
    simpleError(
      "tolerance",
      "Tolerance must be nonnegative.",
      "invalid_tolerance",
    );
  const reportedRatio = input.reportedNumerator / input.reportedDenominator;
  const recomputedRatio = input.sourceNumerator / input.sourceDenominator;
  const ratioDifference = recomputedRatio - reportedRatio;
  if (
    !Number.isFinite(reportedRatio) ||
    !Number.isFinite(recomputedRatio) ||
    !Number.isFinite(ratioDifference)
  )
    simpleError(
      "sourceNumerator",
      "The covenant ratio is not finite.",
      "result_not_finite",
    );
  return {
    compliant:
      reportedRatio <= input.covenantLimit + input.tolerance &&
      recomputedRatio <= input.covenantLimit + input.tolerance,
    recomputedRatio,
    reportedRatio,
    ratioDifference,
  };
};

export const debtCovenantRecomputeExample = {
  input: {
    covenantLimit: 3.5,
    reportedDenominator: 100,
    reportedNumerator: 320,
    sourceDenominator: 200,
    sourceNumerator: 650,
    tolerance: 0.01,
  },
  output: {
    compliant: true,
    recomputedRatio: 3.25,
    reportedRatio: 3.2,
    ratioDifference: 0.04999999999999982,
  },
} satisfies ToolExample<
  DebtCovenantRecomputeInput,
  DebtCovenantRecomputeOutput
>;

export const debtCovenantRecomputeTool = createSimpleTool({
  calculate: (input) =>
    recomputeDebtCovenantCompliance({
      covenantLimit: input.covenantLimit as number,
      reportedDenominator: input.reportedDenominator as number,
      reportedNumerator: input.reportedNumerator as number,
      sourceDenominator: input.sourceDenominator as number,
      sourceNumerator: input.sourceNumerator as number,
      tolerance: input.tolerance as number,
    }),
  description:
    "Independently recompute a debt-covenant ratio from source values, compare it with the reported ratio, and test both against the supplied limit and tolerance.",
  id: "auditing/debt-covenant-compliance-independent-recompute-step",
  inputs: [
    { id: "covenantLimit", kind: "number", label: "Covenant limit" },
    {
      id: "reportedDenominator",
      kind: "number",
      label: "Reported denominator",
    },
    { id: "reportedNumerator", kind: "number", label: "Reported numerator" },
    { id: "sourceDenominator", kind: "number", label: "Source denominator" },
    { id: "sourceNumerator", kind: "number", label: "Source numerator" },
    { id: "tolerance", kind: "number", label: "Tolerance", minimum: 0 },
  ],
  outputs: [
    { id: "compliant", kind: "boolean", label: "Covenant compliant" },
    { id: "recomputedRatio", kind: "number", label: "Recomputed ratio" },
    { id: "reportedRatio", kind: "number", label: "Reported ratio" },
    {
      id: "ratioDifference",
      kind: "number",
      label: "Recomputed minus reported",
    },
  ],
  title: "Debt Covenant Compliance Independent Recompute Step",
});

export const runDebtCovenantRecompute = debtCovenantRecomputeTool.execute;
export default debtCovenantRecomputeTool;
