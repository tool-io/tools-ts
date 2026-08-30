import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type UpperMisstatementInput = {
  readonly otherKnownMisstatements: number;
  readonly projectedMisstatement: number;
  readonly samplingRiskAllowance: number;
  readonly tolerableMisstatement: number;
};

export type UpperMisstatementOutput = {
  readonly exceedsTolerable: boolean;
  readonly remainingAgainstTolerance: number;
  readonly upperLimit: number;
};

export const computeUpperMisstatementLimit = (
  input: UpperMisstatementInput,
): UpperMisstatementOutput => {
  for (const [field, value] of [
    ["otherKnownMisstatements", input.otherKnownMisstatements],
    ["projectedMisstatement", input.projectedMisstatement],
    ["samplingRiskAllowance", input.samplingRiskAllowance],
    ["tolerableMisstatement", input.tolerableMisstatement],
  ] as const)
    if (!Number.isFinite(value) || value < 0)
      simpleError(
        field,
        `${field} must be finite and nonnegative.`,
        "invalid_misstatement_value",
      );
  const upperLimit =
    input.projectedMisstatement +
    input.samplingRiskAllowance +
    input.otherKnownMisstatements;
  if (!Number.isFinite(upperLimit))
    simpleError(
      "samplingRiskAllowance",
      "The upper misstatement limit is outside the representable numeric range.",
      "result_not_finite",
    );
  return {
    exceedsTolerable: upperLimit > input.tolerableMisstatement,
    remainingAgainstTolerance: input.tolerableMisstatement - upperLimit,
    upperLimit,
  };
};

export const upperMisstatementExample = {
  input: {
    otherKnownMisstatements: 5_000,
    projectedMisstatement: 15_000,
    samplingRiskAllowance: 10_000,
    tolerableMisstatement: 45_000,
  },
  output: {
    exceedsTolerable: false,
    remainingAgainstTolerance: 15_000,
    upperLimit: 30_000,
  },
} satisfies ToolExample<UpperMisstatementInput, UpperMisstatementOutput>;

export const upperMisstatementTool = createSimpleTool({
  calculate: (input) =>
    computeUpperMisstatementLimit({
      otherKnownMisstatements: input.otherKnownMisstatements as number,
      projectedMisstatement: input.projectedMisstatement as number,
      samplingRiskAllowance: input.samplingRiskAllowance as number,
      tolerableMisstatement: input.tolerableMisstatement as number,
    }),
  description:
    "Add a sample's projected misstatement and sampling-risk allowance, then combine that upper limit with known misstatements for evaluation against tolerable misstatement.",
  id: "auditing/sample-evaluation-upper-misstatement-limit-computation",
  inputs: [
    {
      id: "otherKnownMisstatements",
      kind: "number",
      label: "Other known misstatements",
      minimum: 0,
    },
    {
      id: "projectedMisstatement",
      kind: "number",
      label: "Projected misstatement",
      minimum: 0,
    },
    {
      id: "samplingRiskAllowance",
      kind: "number",
      label: "Sampling-risk allowance",
      minimum: 0,
    },
    {
      id: "tolerableMisstatement",
      kind: "number",
      label: "Tolerable misstatement",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "exceedsTolerable",
      kind: "boolean",
      label: "Exceeds tolerable misstatement",
    },
    {
      id: "remainingAgainstTolerance",
      kind: "number",
      label: "Remaining against tolerance",
    },
    { id: "upperLimit", kind: "number", label: "Upper limit", minimum: 0 },
  ],
  title: "Sample Evaluation Upper Misstatement Limit Computation",
});

export const runUpperMisstatement = upperMisstatementTool.execute;
export default upperMisstatementTool;
