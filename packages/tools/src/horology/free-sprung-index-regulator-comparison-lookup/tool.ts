import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const regulatorEntries = {
  accuracyClaimCaution: {
    keyDate: "system-specific",
    statement:
      "Free-sprung and index-regulated balances can meet demanding standards, but the regulating architecture alone does not certify accuracy, positional stability, or long-term performance.",
  },
  freeSprungAdjustment: {
    keyDate: "modern system",
    statement:
      "Grand Seiko describes a free-sprung system without a regulator index; balance screws alter moment of inertia to fine-tune rate.",
  },
  indexAdjustment: {
    keyDate: "traditional system",
    statement:
      "An index regulator uses curb pins to vary the effective hairspring length; rate is changed by changing the oscillator's active spring length.",
  },
  isochronismAdjustment: {
    keyDate: "caliber-specific",
    statement:
      "Grand Seiko calibre 9SC5 combines free-sprung regulation with a separate stud movement that can alter isochronism under fixed conditions.",
  },
  serviceTradeoff: {
    keyDate: "service-specific",
    statement:
      "Free-sprung regulation requires controlled inertia adjustments and poise; index regulation is more visibly direct, but neither method is universally superior without the complete movement.",
  },
} as const;

export type RegulatorComparisonFocus = keyof typeof regulatorEntries;

export type RegulatorComparisonLookupInput = {
  readonly comparisonFocus: RegulatorComparisonFocus;
};

export type RegulatorComparisonLookupOutput = {
  readonly comparisonFocus: RegulatorComparisonFocus;
  readonly keyDate: string;
  readonly verifiedStatement: string;
};

export const lookupFreeSprungIndexComparison = (
  input: RegulatorComparisonLookupInput,
): RegulatorComparisonLookupOutput => {
  const entry = regulatorEntries[input.comparisonFocus];
  if (entry === undefined)
    simpleError(
      "comparisonFocus",
      "Regulator comparison focus is not supported.",
      "unsupported_comparison_focus",
    );
  return {
    comparisonFocus: input.comparisonFocus,
    keyDate: entry.keyDate,
    verifiedStatement: entry.statement,
  };
};

export const regulatorComparisonExample = {
  input: { comparisonFocus: "freeSprungAdjustment" },
  output: {
    comparisonFocus: "freeSprungAdjustment",
    keyDate: "modern system",
    verifiedStatement:
      "Grand Seiko describes a free-sprung system without a regulator index; balance screws alter moment of inertia to fine-tune rate.",
  },
} satisfies ToolExample<
  RegulatorComparisonLookupInput,
  RegulatorComparisonLookupOutput
>;

export const regulatorComparisonTool = createSimpleTool({
  calculate: (input) =>
    lookupFreeSprungIndexComparison({
      comparisonFocus: input.comparisonFocus as RegulatorComparisonFocus,
    }),
  description:
    "Return free-sprung inertia adjustment, index curb-pin adjustment, isochronism control, service tradeoff, or non-absolute accuracy fact.",
  id: "horology/free-sprung-index-regulator-comparison-lookup",
  inputs: [
    {
      enum: [
        "freeSprungAdjustment",
        "indexAdjustment",
        "isochronismAdjustment",
        "serviceTradeoff",
        "accuracyClaimCaution",
      ],
      id: "comparisonFocus",
      kind: "string",
      label: "Free-sprung versus index regulator focus",
    },
  ],
  outputs: [
    {
      id: "comparisonFocus",
      kind: "string",
      label: "Free-sprung versus index regulator focus",
    },
    { id: "keyDate", kind: "string", label: "Regulator context" },
    {
      id: "verifiedStatement",
      kind: "string",
      label: "Verified regulator statement",
    },
  ],
  title: "Free Sprung Index Regulator Comparison Lookup",
});

export const runRegulatorComparison = regulatorComparisonTool.execute;
export default regulatorComparisonTool;
