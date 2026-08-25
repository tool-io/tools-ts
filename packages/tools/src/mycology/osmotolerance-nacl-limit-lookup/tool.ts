import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OsmotoleranceNaclLimitLookupInput = {
  readonly growthAtPercentNacl: number;
  readonly moderateMinimumPercent: number;
  readonly tolerantMinimumPercent: number;
};

export type OsmotoleranceNaclLimitLookupOutput = {
  readonly osmotoleranceClass: string;
};

export const osmotoleranceNaclLimitLookupExample = {
  input: {
    growthAtPercentNacl: 7.5,
    moderateMinimumPercent: 5,
    tolerantMinimumPercent: 10.1,
  },
  output: { osmotoleranceClass: "moderately-osmotolerant" },
} satisfies ToolExample<
  OsmotoleranceNaclLimitLookupInput,
  OsmotoleranceNaclLimitLookupOutput
>;

export const osmotoleranceNaclLimitLookupTool = createSimpleTool({
  id: "mycology/osmotolerance-nacl-limit-lookup",
  title: "NaCl Limit Lookup",
  description:
    "Classify a maximum growth-supporting NaCl concentration using caller-supplied boundaries appropriate to the organism, medium, and incubation protocol.",
  inputs: [
    {
      id: "growthAtPercentNacl",
      kind: "number",
      label: "Maximum growth NaCl",
      maximum: 25,
      minimum: 0,
      unit: "%",
    },
    {
      id: "moderateMinimumPercent",
      kind: "number",
      label: "Moderately osmotolerant minimum",
      maximum: 25,
      minimum: 0,
      unit: "%",
    },
    {
      id: "tolerantMinimumPercent",
      kind: "number",
      label: "Osmotolerant minimum",
      maximum: 25,
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      enum: ["non-osmotolerant", "moderately-osmotolerant", "osmotolerant"],
      id: "osmotoleranceClass",
      kind: "string",
      label: "Osmotolerance class",
    },
  ],
  calculate: (input) => {
    const growthAtPercentNacl = input.growthAtPercentNacl as number;
    const moderateMinimumPercent = input.moderateMinimumPercent as number;
    const tolerantMinimumPercent = input.tolerantMinimumPercent as number;
    if (!(tolerantMinimumPercent > moderateMinimumPercent))
      simpleError(
        "tolerantMinimumPercent",
        "The osmotolerant minimum must exceed the moderately osmotolerant minimum.",
      );
    return {
      osmotoleranceClass:
        growthAtPercentNacl < moderateMinimumPercent
          ? "non-osmotolerant"
          : growthAtPercentNacl < tolerantMinimumPercent
            ? "moderately-osmotolerant"
            : "osmotolerant",
    };
  },
});
export const runOsmotoleranceNaclLimitLookup =
  osmotoleranceNaclLimitLookupTool.execute;
export default osmotoleranceNaclLimitLookupTool;
