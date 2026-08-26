import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LaminateUsageClass = "31" | "32" | "33";

export type LaminateClassLookupInput = {
  readonly usageClass: LaminateUsageClass;
};

export type LaminateClassLookupOutput = {
  readonly acRating: string;
  readonly maxCommercialYears: number;
};

const LAMINATE_CLASSES: Record<
  LaminateUsageClass,
  {
    readonly acRating: string;
    readonly maxCommercialYears: number;
  }
> = {
  "31": { acRating: "AC3", maxCommercialYears: 2 },
  "32": { acRating: "AC4", maxCommercialYears: 4 },
  "33": { acRating: "AC5", maxCommercialYears: 6 },
};

export const laminateClassLookupExample = {
  input: { usageClass: "32" },
  output: { acRating: "AC4", maxCommercialYears: 4 },
} satisfies ToolExample<LaminateClassLookupInput, LaminateClassLookupOutput>;

export const laminateClassLookupTool = createSimpleTool({
  id: "carpentry/laminat-klasse-31-32-33-lookup",
  title: "Laminate Class Lookup",
  description:
    "Look up the AC rating and maximum commercial service years of a laminate usage class.",
  inputs: [
    {
      description:
        "European laminate usage class for the intended area of use.",
      enum: ["31", "32", "33"],
      id: "usageClass",
      kind: "string",
      label: "Usage class",
    },
  ],
  outputs: [
    {
      description: "Abrasion class rating such as AC4.",
      id: "acRating",
      kind: "string",
      label: "AC rating",
    },
    {
      description: "Maximum recommended commercial service years.",
      format: "count",
      id: "maxCommercialYears",
      kind: "integer",
      label: "Maximum commercial years",
      unit: "years",
    },
  ],
  calculate: (input) => {
    const usageClass = input.usageClass as LaminateUsageClass;
    if (!(usageClass in LAMINATE_CLASSES))
      simpleError(
        "usageClass",
        "Unknown laminate usage class.",
        "unknown_usage_class",
      );
    return LAMINATE_CLASSES[usageClass];
  },
});
export const runLaminateClassLookup = laminateClassLookupTool.execute;
export default laminateClassLookupTool;
