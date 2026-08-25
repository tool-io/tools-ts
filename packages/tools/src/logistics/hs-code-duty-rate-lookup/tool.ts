import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HsCodeDutyRateLookupInput = {
  readonly dutyRatePercentOverride: number;
  readonly hsCode: string;
  readonly preferentialRatePercent?: number;
};

export type HsCodeDutyRateLookupOutput = {
  readonly appliedDutyRatePercent: number;
  readonly chapter: string;
  readonly heading: string;
  readonly rateSource: "preferential" | "override";
  readonly subheading: string;
};

export const calculateHsCodeDutyRateLookup = (
  input: HsCodeDutyRateLookupInput,
): HsCodeDutyRateLookupOutput => {
  if (typeof input.hsCode !== "string" || !/^\d{6,10}$/.test(input.hsCode))
    return simpleError(
      "hsCode",
      "hsCode must be 6 to 10 digits.",
      "invalid_hs_code",
    );
  const chapter = input.hsCode.slice(0, 2);
  const heading = input.hsCode.slice(0, 4);
  const subheading = input.hsCode.slice(0, 6);
  if (
    !Number.isFinite(input.dutyRatePercentOverride) ||
    input.dutyRatePercentOverride < 0
  )
    return simpleError(
      "dutyRatePercentOverride",
      "The supplied duty rate must be finite and non-negative.",
      "invalid_rate",
    );
  if (
    input.preferentialRatePercent !== undefined &&
    (!Number.isFinite(input.preferentialRatePercent) ||
      (input.preferentialRatePercent < 0 &&
        input.preferentialRatePercent !== -1))
  )
    return simpleError(
      "preferentialRatePercent",
      "The preferential rate must be -1 (not supplied) or a finite non-negative percentage.",
      "invalid_rate",
    );
  let appliedDutyRatePercent = input.dutyRatePercentOverride;
  let rateSource: "preferential" | "override" = "override";
  if (
    input.preferentialRatePercent !== undefined &&
    input.preferentialRatePercent >= 0
  ) {
    appliedDutyRatePercent = input.preferentialRatePercent;
    rateSource = "preferential";
  }
  return {
    appliedDutyRatePercent,
    chapter,
    heading,
    rateSource,
    subheading,
  };
};

export const hsCodeDutyRateLookupExample = {
  input: { dutyRatePercentOverride: 16, hsCode: "610910" },
  output: {
    appliedDutyRatePercent: 16,
    chapter: "61",
    heading: "6109",
    rateSource: "override",
    subheading: "610910",
  },
} satisfies ToolExample<HsCodeDutyRateLookupInput, HsCodeDutyRateLookupOutput>;

export const hsCodeDutyRateLookupTool = createSimpleTool({
  id: "logistics/hs-code-duty-rate-lookup",
  title: "HS Code and Duty Rate Resolver",
  description:
    "Split a 6- to 10-digit HS or national tariff code into chapter, heading, and HS subheading, then resolve a supplied general or preferential ad-valorem rate. Rates are not inferred from the first two digits because the applicable tariff depends on the full classification, jurisdiction, origin, and date.",
  inputs: [
    {
      description:
        "Duty rate obtained from the applicable current tariff schedule.",
      id: "dutyRatePercentOverride",
      kind: "number",
      label: "Duty override",
      minimum: 0,
    },
    {
      description: "Harmonized System code, 6 to 10 digits.",
      id: "hsCode",
      kind: "string",
      label: "HS code",
    },
    {
      default: -1,
      description:
        "Preferential rate when eligibility has been established; use -1 when no preferential rate applies.",
      id: "preferentialRatePercent",
      kind: "number",
      label: "FTA rate",
      minimum: -1,
    },
  ],
  outputs: [
    {
      description: "Applied ad-valorem duty rate in percent.",
      id: "appliedDutyRatePercent",
      kind: "number",
      label: "Duty rate",
    },
    {
      description: "First two digits of the HS code.",
      id: "chapter",
      kind: "string",
      label: "Chapter",
    },
    {
      description: "First four digits of the HS code.",
      id: "heading",
      kind: "string",
      label: "Heading",
    },
    {
      description: "Which source produced the applied rate.",
      enum: ["preferential", "override"],
      id: "rateSource",
      kind: "string",
      label: "Rate source",
    },
    {
      description: "First six digits of the HS code.",
      id: "subheading",
      kind: "string",
      label: "Subheading",
    },
  ],
  calculate: (input) =>
    calculateHsCodeDutyRateLookup({
      dutyRatePercentOverride: input.dutyRatePercentOverride as number,
      hsCode: input.hsCode as string,
      preferentialRatePercent: input.preferentialRatePercent as
        number | undefined,
    }),
});

export const runHsCodeDutyRateLookup = hsCodeDutyRateLookupTool.execute;
export default hsCodeDutyRateLookupTool;
