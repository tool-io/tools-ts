import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PrimaryInfecundityPercentLookupInput = {
  readonly infecundWomen: number;
  readonly totalWomen: number;
};

export type PrimaryInfecundityPercentLookupOutput = {
  readonly infecundityPercent: number;
  readonly level: "low" | "moderate" | "elevated";
};

export const calculatePrimaryInfecundityPercentLookup = (
  input: PrimaryInfecundityPercentLookupInput,
): PrimaryInfecundityPercentLookupOutput => {
  if (!(input.infecundWomen >= 0))
    simpleError(
      "infecundWomen",
      "The number of infecund women must be non-negative.",
      "invalid_count",
    );
  if (!(input.totalWomen > 0))
    simpleError(
      "totalWomen",
      "The total number of women must be greater than zero.",
      "invalid_count",
    );
  if (input.infecundWomen > input.totalWomen)
    simpleError(
      "infecundWomen",
      "Infecund women cannot exceed the total.",
      "invalid_count",
    );
  const infecundityPercent = (input.infecundWomen / input.totalWomen) * 100;
  return {
    infecundityPercent,
    level:
      infecundityPercent < 2.5
        ? "low"
        : infecundityPercent <= 5
          ? "moderate"
          : "elevated",
  };
};

export const primaryInfecundityPercentLookupExample = {
  input: { infecundWomen: 3, totalWomen: 150 },
  output: { infecundityPercent: 2, level: "low" },
} satisfies ToolExample<
  PrimaryInfecundityPercentLookupInput,
  PrimaryInfecundityPercentLookupOutput
>;

export const primaryInfecundityPercentLookupTool = createSimpleTool({
  id: "demography/primary-infecundity-percent-lookup",
  title: "Primary Infecundity Percent Lookup",
  description:
    "Compute the percentage of women with primary infecundity and classify it as low below 2.5 percent, moderate from 2.5 to 5 percent, or elevated above 5 percent.",
  inputs: [
    {
      description: "Number of women who never conceived.",
      id: "infecundWomen",
      kind: "number",
      label: "Infecund",
      minimum: 0,
    },
    {
      description: "Total exposed women examined.",
      id: "totalWomen",
      kind: "number",
      label: "Total",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Primary infecundity as percent of exposed women.",
      id: "infecundityPercent",
      kind: "number",
      label: "Percent",
    },
    {
      description: "Heuristic band for the observed percentage.",
      enum: ["low", "moderate", "elevated"],
      id: "level",
      kind: "string",
      label: "Level",
    },
  ],
  calculate: (input) =>
    calculatePrimaryInfecundityPercentLookup(
      input as unknown as PrimaryInfecundityPercentLookupInput,
    ),
});

export const runPrimaryInfecundityPercentLookup =
  primaryInfecundityPercentLookupTool.execute;
export default primaryInfecundityPercentLookupTool;
