import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ContractionLossDetectorInput = {
  readonly exemplarAbbreviatedForms: number;
  readonly copyAbbreviatedForms: number;
};

export type ContractionLossDetectorOutput = {
  readonly netChangePercent: number;
  readonly lostForms: number;
  readonly addedForms: number;
  readonly lossRating:
    "no_change" | "minor_loss" | "moderate_loss" | "major_loss" | "expansion";
};

export const calculateContractionLossDetector = (
  input: ContractionLossDetectorInput,
): ContractionLossDetectorOutput => {
  if (!(
    Number.isSafeInteger(input.exemplarAbbreviatedForms) &&
    input.exemplarAbbreviatedForms >= 1
  ))
    return simpleError(
      "exemplarAbbreviatedForms",
      "Exemplar abbreviated-form count must be at least one.",
      "invalid_count",
    );
  if (!(
    Number.isSafeInteger(input.copyAbbreviatedForms) &&
    input.copyAbbreviatedForms >= 0
  ))
    return simpleError(
      "copyAbbreviatedForms",
      "Copy abbreviated-form count must be non-negative.",
      "invalid_count",
    );
  const netChangePercent =
    ((input.copyAbbreviatedForms - input.exemplarAbbreviatedForms) /
      input.exemplarAbbreviatedForms) *
    100;
  const lostForms = Math.max(
    0,
    input.exemplarAbbreviatedForms - input.copyAbbreviatedForms,
  );
  const addedForms = Math.max(
    0,
    input.copyAbbreviatedForms - input.exemplarAbbreviatedForms,
  );
  const lossRating =
    netChangePercent === 0
      ? "no_change"
      : netChangePercent <= -15
        ? "major_loss"
        : netChangePercent <= -5
          ? "moderate_loss"
          : netChangePercent < 0
            ? "minor_loss"
            : "expansion";
  return { netChangePercent, lostForms, addedForms, lossRating };
};

export const contractionLossDetectorExample = {
  input: { exemplarAbbreviatedForms: 40, copyAbbreviatedForms: 38 },
  output: {
    netChangePercent: -5,
    lostForms: 2,
    addedForms: 0,
    lossRating: "moderate_loss",
  },
} satisfies ToolExample<
  ContractionLossDetectorInput,
  ContractionLossDetectorOutput
>;

export const contractionLossDetectorTool = createSimpleTool({
  id: "paleography/contraction-loss-detector",
  description:
    "Measure how many scribal contraction abbreviations survive from exemplar to copy: exact percent change with the stated rating bands (no change at zero, minor under five percent dropped, moderate five to fifteen, major above fifteen, any increase is expansion).",
  title: "Contraction Loss Detector",
  inputs: [
    {
      description: "Abbreviated forms counted in the exemplar.",
      id: "exemplarAbbreviatedForms",
      kind: "integer",
      label: "Exemplar forms",
      minimum: 1,
    },
    {
      description: "Abbreviated forms counted in the copy.",
      id: "copyAbbreviatedForms",
      kind: "integer",
      label: "Copy forms",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Signed percent change from exemplar to copy.",
      id: "netChangePercent",
      kind: "number",
      label: "Net change %",
    },
    {
      description: "Forms present in the exemplar but absent in the copy.",
      id: "lostForms",
      kind: "integer",
      label: "Lost forms",
    },
    {
      description: "Forms introduced by the copyist.",
      id: "addedForms",
      kind: "integer",
      label: "Added forms",
    },
    {
      description: "Stated-band rating of abbreviation retention.",
      id: "lossRating",
      enum: [
        "no_change",
        "minor_loss",
        "moderate_loss",
        "major_loss",
        "expansion",
      ],
      kind: "string",
      label: "Loss rating",
    },
  ],
  calculate: (input) =>
    calculateContractionLossDetector({
      copyAbbreviatedForms: input.copyAbbreviatedForms as number,
      exemplarAbbreviatedForms: input.exemplarAbbreviatedForms as number,
    }),
});

export const runContractionLossDetector = contractionLossDetectorTool.execute;
export default contractionLossDetectorTool;
