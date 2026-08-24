import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BeneventanZoneLocatorInput = {
  readonly century: number;
  readonly region?:
    "montecassino" | "southern_italy" | "dalmatian_coast" | "elsewhere";
};

export type BeneventanZoneLocatorOutput = {
  readonly usagePhase:
    | "pre_beneventan"
    | "earliest_witnesses"
    | "classic_floruit"
    | "decline_and_shrinkage"
    | "residual_survival"
    | "extinct_as_working_hand";
  readonly coreRegion: boolean;
};

export const calculateBeneventanZoneLocator = (
  input: BeneventanZoneLocatorInput,
): BeneventanZoneLocatorOutput => {
  if (!(
    Number.isSafeInteger(input.century) &&
    input.century >= 1 &&
    input.century <= 20
  ))
    return simpleError(
      "century",
      "Century must be a positive integer.",
      "invalid_century",
    );
  const century = input.century;
  const region = input.region ?? "southern_italy";
  const usagePhase =
    century <= 7
      ? "pre_beneventan"
      : century === 8
        ? "earliest_witnesses"
        : century <= 11
          ? "classic_floruit"
          : century <= 13
            ? "decline_and_shrinkage"
            : century <= 16
              ? "residual_survival"
              : "extinct_as_working_hand";
  return { usagePhase, coreRegion: region !== "elsewhere" };
};

export const beneventanZoneLocatorExample = {
  input: { century: 11, region: "montecassino" },
  output: { usagePhase: "classic_floruit", coreRegion: true },
} satisfies ToolExample<
  BeneventanZoneLocatorInput,
  BeneventanZoneLocatorOutput
>;

export const beneventanZoneLocatorTool = createSimpleTool({
  id: "paleography/beneventan-zone-locator",
  title: "Beneventan Zone Locator",
  description:
    "Locate a century on the documented Beneventan phase table (pre-Beneventan to 7th c., earliest witnesses 8th, classic floruit 9th-11th, decline 12th-13th, residual survival 14th-16th, extinct from the 17th) and flag whether the region is within the Beneventan zone (Montecassino, southern Italy or the Dalmatian coast).",
  inputs: [
    {
      description: "Century number of the witness.",
      id: "century",
      kind: "integer",
      label: "Century",
      maximum: 20,
      minimum: 1,
    },
    {
      default: "southern_italy",
      description: "Region of production.",
      enum: ["montecassino", "southern_italy", "dalmatian_coast", "elsewhere"],
      id: "region",
      kind: "string",
      label: "Region",
    },
  ],
  outputs: [
    {
      description: "Beneventan usage phase for the given century.",
      id: "usagePhase",
      enum: [
        "pre_beneventan",
        "earliest_witnesses",
        "classic_floruit",
        "decline_and_shrinkage",
        "residual_survival",
        "extinct_as_working_hand",
      ],
      kind: "string",
      label: "Usage phase",
    },
    {
      description: "True when the region lies inside the Beneventan zone.",
      id: "coreRegion",
      kind: "boolean",
      label: "Core region",
    },
  ],
  calculate: (input) =>
    calculateBeneventanZoneLocator({
      century: input.century as number,
      region: input.region as BeneventanZoneLocatorInput["region"],
    }),
});

export const runBeneventanZoneLocator = beneventanZoneLocatorTool.execute;
export default beneventanZoneLocatorTool;
