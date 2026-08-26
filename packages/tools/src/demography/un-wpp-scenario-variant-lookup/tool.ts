import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type UnWppScenarioVariantLookupInput = {
  readonly variant:
    | "estimation"
    | "medium"
    | "high"
    | "low"
    | "constantFertility"
    | "instantReplacementFertility"
    | "zeroMigration"
    | "momentum"
    | "constantMortality"
    | "noChange";
};

export type UnWppScenarioVariantLookupOutput = {
  readonly fullName: string;
  readonly summary: string;
};

const VARIANT_NAME = {
  estimation: "World Population Prospects estimates",
  medium: "Medium variant",
  high: "High variant",
  low: "Low variant",
  constantFertility: "Constant-fertility variant",
  instantReplacementFertility: "Instant-replacement-fertility variant",
  zeroMigration: "Zero-migration variant",
  momentum: "Momentum variant",
  constantMortality: "Constant-mortality variant",
  noChange: "No-change variant",
} as const;

const VARIANT_SUMMARY = {
  estimation:
    "Estimated historical demographic indicators through the base year of the revision.",
  medium:
    "Median projection combining median fertility and median mortality paths; treated as the most likely scenario.",
  high: "High-fertility scenario in which total fertility runs half a child above the medium path in every country.",
  low: "Low-fertility scenario in which total fertility runs half a child below the medium path in every country.",
  constantFertility:
    "Fertility held fixed at the level estimated for the projection start while mortality follows the medium path.",
  instantReplacementFertility:
    "Fertility set immediately to replacement level at the projection start and held there, with medium mortality.",
  zeroMigration:
    "Net international migration set to zero from the projection start onward, with medium fertility and mortality.",
  momentum:
    "Instant replacement fertility combined with zero migration to isolate the growth built into the existing age structure.",
  constantMortality:
    "Mortality held fixed at the levels estimated for the projection start while fertility follows the medium path.",
  noChange:
    "Both fertility and mortality held fixed at their estimated starting levels from the projection start onward.",
} as const;

export const calculateUnWppScenarioVariantLookup = (
  input: UnWppScenarioVariantLookupInput,
): UnWppScenarioVariantLookupOutput => {
  if (!(input.variant in VARIANT_NAME))
    simpleError(
      "variant",
      "Choose one of the documented WPP projection variants.",
      "invalid_variant",
    );
  return {
    fullName: VARIANT_NAME[input.variant],
    summary: VARIANT_SUMMARY[input.variant],
  };
};

export const unWppScenarioVariantLookupExample = {
  input: { variant: "medium" },
  output: {
    fullName: "Medium variant",
    summary:
      "Median projection combining median fertility and median mortality paths; treated as the most likely scenario.",
  },
} satisfies ToolExample<
  UnWppScenarioVariantLookupInput,
  UnWppScenarioVariantLookupOutput
>;

export const unWppScenarioVariantLookupTool = createSimpleTool({
  id: "demography/un-wpp-scenario-variant-lookup",
  title: "UN WPP Scenario Variant Lookup",
  description:
    "Identify a World Population Prospects projection or estimation variant by its conventional name and a one-sentence description of how its fertility, mortality and migration assumptions differ from the medium path.",
  inputs: [
    {
      description:
        "Projection or estimation variant of the World Population Prospects.",
      enum: [
        "estimation",
        "medium",
        "high",
        "low",
        "constantFertility",
        "instantReplacementFertility",
        "zeroMigration",
        "momentum",
        "constantMortality",
        "noChange",
      ],
      id: "variant",
      kind: "string",
      label: "Variant",
    },
  ],
  outputs: [
    {
      description: "Conventional name of the variant.",
      id: "fullName",
      kind: "string",
      label: "Name",
    },
    {
      description: "One-sentence description of the variant's assumptions.",
      id: "summary",
      kind: "string",
      label: "Summary",
    },
  ],
  calculate: (input) =>
    calculateUnWppScenarioVariantLookup(
      input as unknown as UnWppScenarioVariantLookupInput,
    ),
});

export const runUnWppScenarioVariantLookup =
  unWppScenarioVariantLookupTool.execute;
export default unWppScenarioVariantLookupTool;
