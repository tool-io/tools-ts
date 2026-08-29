import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const surveyDesignFoldCountCmpBinningSummaryExample = {
  input: { receiverCount: 121, receiverSpacingM: 50, shotSpacingM: 100 },
  output: { nominalFold: 30.25, cmpBinM: 25 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const surveyDesignFoldCountCmpBinningSummaryTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ receiverCount, receiverSpacingM, shotSpacingM }) => {
      if (receiverCount < 2)
        simpleError(
          "receiverCount",
          "At least two active receivers are required.",
        );
      if (receiverSpacingM <= 0)
        simpleError("receiverSpacingM", "Receiver spacing must be positive.");
      if (shotSpacingM <= 0)
        simpleError("shotSpacingM", "Shot spacing must be positive.");
      const fold = (receiverCount * receiverSpacingM) / (2 * shotSpacingM);
      return { nominalFold: fold, cmpBinM: receiverSpacingM / 2 };
    })(input as never) as Record<string, unknown>,
  description:
    "Nominal 2-D end-on acquisition fold N·Δr/(2·Δs) and CMP interval Δr/2 for a regular source/receiver grid; actual edge fold and irregular geometry require explicit trace counting.",
  id: "seismology/survey-design-fold-count-cmp-binning-summary",
  inputs: [
    {
      minimum: 2,
      description: "Active receivers per shot.",
      id: "receiverCount",
      kind: "integer",
      label: "N_r",
    },
    {
      minimum: 0,
      description: "Receiver group interval.",
      id: "receiverSpacingM",
      kind: "number",
      label: "Δr",
      unit: "m",
    },
    {
      minimum: 0,
      description: "Shot-point interval.",
      id: "shotSpacingM",
      kind: "number",
      label: "Δs",
      unit: "m",
    },
  ],
  outputs: [
    {
      description: "Nominal fold-of-coverage.",
      id: "nominalFold",
      kind: "number",
      label: "fold",
    },
    {
      description: "CMP interval for the assumed regular grid.",
      id: "cmpBinM",
      kind: "number",
      label: "bin",
      unit: "m",
    },
  ],
  title: "Survey Design Fold Count CMP Binning Summary",
});
export const runSurveyDesignFoldCountCmpBinningSummary =
  surveyDesignFoldCountCmpBinningSummaryTool.execute;
export { surveyDesignFoldCountCmpBinningSummaryExample as example };
export default surveyDesignFoldCountCmpBinningSummaryTool;
