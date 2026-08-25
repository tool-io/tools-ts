import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CertificateOriginFtaThresholdLookupInput = {
  readonly deMinimisAllowancePoints?: number;
  readonly regionalValueContentPercent: number;
  readonly thresholdPercentRequired: number;
};

export type CertificateOriginFtaThresholdLookupOutput = {
  readonly basis: "below_threshold" | "meets_threshold" | "within_de_minimis";
  readonly marginPoints: number;
  readonly qualifies: boolean;
};

export const calculateCertificateOriginFtaThresholdLookup = (
  input: CertificateOriginFtaThresholdLookupInput,
): CertificateOriginFtaThresholdLookupOutput => {
  const deMinimisAllowancePoints = input.deMinimisAllowancePoints ?? 0;
  for (const [field, value] of [
    ["deMinimisAllowancePoints", deMinimisAllowancePoints],
    ["regionalValueContentPercent", input.regionalValueContentPercent],
    ["thresholdPercentRequired", input.thresholdPercentRequired],
  ] as const) {
    if (!Number.isFinite(value) || value < 0 || value > 100)
      return simpleError(
        field,
        "Percentage values must be finite and between zero and one hundred.",
        "invalid_percent",
      );
  }
  const marginPoints =
    input.regionalValueContentPercent - input.thresholdPercentRequired;
  const qualifies =
    marginPoints >= 0 || -marginPoints <= deMinimisAllowancePoints;
  return {
    basis: qualifies
      ? marginPoints >= 0
        ? "meets_threshold"
        : "within_de_minimis"
      : "below_threshold",
    marginPoints,
    qualifies,
  };
};

export const certificateOriginFtaThresholdLookupExample = {
  input: {
    deMinimisAllowancePoints: 0,
    regionalValueContentPercent: 42.5,
    thresholdPercentRequired: 40,
  },
  output: { basis: "meets_threshold", marginPoints: 2.5, qualifies: true },
} satisfies ToolExample<
  CertificateOriginFtaThresholdLookupInput,
  CertificateOriginFtaThresholdLookupOutput
>;

export const certificateOriginFtaThresholdLookupTool = createSimpleTool({
  id: "logistics/certificate-origin-fta-threshold-lookup",
  title: "Certificate of Origin FTA Threshold Check",
  description:
    "Screen achieved regional value content against an agreement-specific threshold and optional shortfall allowance. Only use the allowance when the applicable rule explicitly permits it in RVC percentage points; this calculation does not establish preferential origin by itself.",
  inputs: [
    {
      default: 0,
      description:
        "Agreement-specific RVC shortfall allowance in percentage points; use zero unless the applicable origin rule explicitly permits it.",
      id: "deMinimisAllowancePoints",
      kind: "number",
      label: "De minimis",
      maximum: 100,
      minimum: 0,
      unit: "percentage points",
    },
    {
      description: "Achieved regional value content in percent.",
      id: "regionalValueContentPercent",
      kind: "number",
      label: "RVC achieved",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      description: "RVC threshold demanded by the agreement in percent.",
      id: "thresholdPercentRequired",
      kind: "number",
      label: "RVC threshold",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      description: "Why the good passes or fails the origin rule.",
      enum: ["meets_threshold", "within_de_minimis", "below_threshold"],
      id: "basis",
      kind: "string",
      label: "Basis",
    },
    {
      description: "RVC minus threshold in points; negative means shortfall.",
      id: "marginPoints",
      kind: "number",
      label: "Margin",
      minimum: -100,
      maximum: 100,
      unit: "percentage points",
    },
    {
      description:
        "True when the supplied numeric threshold rule passes; other origin requirements may still apply.",
      id: "qualifies",
      kind: "boolean",
      label: "Qualifies",
    },
  ],
  calculate: (input) =>
    calculateCertificateOriginFtaThresholdLookup({
      deMinimisAllowancePoints: input.deMinimisAllowancePoints as
        number | undefined,
      regionalValueContentPercent: input.regionalValueContentPercent as number,
      thresholdPercentRequired: input.thresholdPercentRequired as number,
    }),
});

export const runCertificateOriginFtaThresholdLookup =
  certificateOriginFtaThresholdLookupTool.execute;
export default certificateOriginFtaThresholdLookupTool;
