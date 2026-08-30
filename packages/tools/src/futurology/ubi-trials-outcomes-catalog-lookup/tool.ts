import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type UbiTrialsCatalogInput = {
  readonly reportedOutcomes: ReadonlyArray<string>;
  readonly studyDesigns: ReadonlyArray<string>;
  readonly trialNames: ReadonlyArray<string>;
};

export type UbiTrialsCatalogOutput = {
  readonly catalogComplete: boolean;
  readonly catalogEntries: ReadonlyArray<string>;
  readonly outcomeCoverageCount: number;
  readonly trialsWithoutOutcomes: ReadonlyArray<string>;
};

export const buildUbiTrialsOutcomesCatalog = (
  input: UbiTrialsCatalogInput,
): UbiTrialsCatalogOutput => {
  if (!Array.isArray(input.trialNames) || input.trialNames.length === 0)
    simpleError(
      "trialNames",
      "At least one trial name is required.",
      "trial_names_required",
    );
  if (
    !Array.isArray(input.studyDesigns) ||
    input.studyDesigns.length !== input.trialNames.length
  )
    simpleError(
      "studyDesigns",
      "Each trial must have one study design.",
      "study_designs_length_mismatch",
    );
  if (
    !Array.isArray(input.reportedOutcomes) ||
    input.reportedOutcomes.length !== input.trialNames.length
  )
    simpleError(
      "reportedOutcomes",
      "Each trial must have one outcome field.",
      "outcomes_length_mismatch",
    );
  const trialNames = input.trialNames.map((trialName, index) => {
    if (typeof trialName !== "string" || trialName.trim() === "")
      simpleError(
        `trialNames.${index}`,
        "Trial names must be nonempty strings.",
        "invalid_trial_name",
      );
    return trialName.trim();
  });
  if (new Set(trialNames).size !== trialNames.length)
    simpleError(
      "trialNames",
      "Trial names must be unique.",
      "duplicate_trial_name",
    );
  const studyDesigns = input.studyDesigns.map((studyDesign, index) => {
    if (typeof studyDesign !== "string" || studyDesign.trim() === "")
      simpleError(
        `studyDesigns.${index}`,
        "Study designs must be nonempty strings.",
        "invalid_study_design",
      );
    return studyDesign.trim();
  });
  const normalizedOutcomes = input.reportedOutcomes.map((outcome, index) =>
    typeof outcome === "string" ? outcome.trim() : outcome,
  );
  const trialsWithoutOutcomes = trialNames.filter(
    (_, index) => normalizedOutcomes[index] === "",
  );
  return {
    catalogComplete: trialsWithoutOutcomes.length === 0,
    catalogEntries: trialNames.map(
      (trialName, index) =>
        `${trialName} | design=${studyDesigns[index]} | outcome=${normalizedOutcomes[index] || "not supplied"}`,
    ),
    outcomeCoverageCount: trialNames.length - trialsWithoutOutcomes.length,
    trialsWithoutOutcomes,
  };
};

export const ubiTrialsCatalogExample = {
  input: {
    reportedOutcomes: ["Wages and employment tracked", ""],
    studyDesigns: ["Pilot", "RCT"],
    trialNames: ["City A", "Region B"],
  },
  output: {
    catalogComplete: false,
    catalogEntries: [
      "City A | design=Pilot | outcome=Wages and employment tracked",
      "Region B | design=RCT | outcome=not supplied",
    ],
    outcomeCoverageCount: 1,
    trialsWithoutOutcomes: ["Region B"],
  },
} satisfies ToolExample<UbiTrialsCatalogInput, UbiTrialsCatalogOutput>;

export const ubiTrialsCatalogTool = createSimpleTool({
  calculate: (input) =>
    buildUbiTrialsOutcomesCatalog({
      reportedOutcomes: input.reportedOutcomes as string[],
      studyDesigns: input.studyDesigns as string[],
      trialNames: input.trialNames as string[],
    }),
  description:
    "Build a caller-supplied universal-basic-income trial outcomes catalog and report missing outcome coverage.",
  id: "futurology/ubi-trials-outcomes-catalog-lookup",
  inputs: [
    {
      description:
        "One outcome string per trial, using an empty string when unavailable.",
      id: "reportedOutcomes",
      kind: "stringList",
      label: "Reported outcomes",
    },
    { id: "studyDesigns", kind: "stringList", label: "Study designs" },
    { id: "trialNames", kind: "stringList", label: "Trial names" },
  ],
  outputs: [
    {
      id: "catalogComplete",
      kind: "boolean",
      label: "Outcome coverage complete",
    },
    { id: "catalogEntries", kind: "stringList", label: "Catalog entries" },
    {
      id: "outcomeCoverageCount",
      kind: "integer",
      label: "Trials with outcomes",
      minimum: 0,
    },
    {
      id: "trialsWithoutOutcomes",
      kind: "stringList",
      label: "Trials without outcomes",
    },
  ],
  title: "UBI Trials Outcomes Catalog Lookup",
});

export const runUbiTrialsCatalog = ubiTrialsCatalogTool.execute;
export default ubiTrialsCatalogTool;
