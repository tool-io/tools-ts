import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WantedVsActualFertilityGapInput = {
  readonly actualTfr: number;
  readonly wantedTfr: number;
};

export type WantedVsActualFertilityGapOutput = {
  readonly fertilityGap: number;
  readonly unwantedSharePercent: number;
};

export const calculateWantedVsActualFertilityGap = (
  input: WantedVsActualFertilityGapInput,
): WantedVsActualFertilityGapOutput => {
  if (!(input.actualTfr >= 0))
    return simpleError(
      "actualTfr",
      "The observed total fertility rate must be non-negative.",
      "invalid_tfr",
    );
  if (!(input.wantedTfr >= 0))
    return simpleError(
      "wantedTfr",
      "The wanted total fertility rate must be non-negative.",
      "invalid_tfr",
    );
  if (input.actualTfr === 0)
    return simpleError(
      "actualTfr",
      "An observed total fertility rate greater than zero is needed for the share.",
      "invalid_tfr",
    );
  const fertilityGap = input.actualTfr - input.wantedTfr;
  return {
    fertilityGap,
    unwantedSharePercent: (fertilityGap / input.actualTfr) * 100,
  };
};

export const wantedVsActualFertilityGapExample = {
  input: { actualTfr: 4.6, wantedTfr: 3.4 },
  output: {
    fertilityGap: 1.1999999999999997,
    unwantedSharePercent: 26.086956521739125,
  },
} satisfies ToolExample<
  WantedVsActualFertilityGapInput,
  WantedVsActualFertilityGapOutput
>;

export const wantedVsActualFertilityGapTool = createSimpleTool({
  id: "demography/wanted-vs-actual-fertility-gap",
  title: "Wanted Versus Actual Fertility Gap",
  description:
    "Compute the gap between observed total fertility and the wanted total fertility reported in survey style questions, together with the share of observed fertility that exceeds wanted fertility.",
  inputs: [
    {
      description: "Observed total fertility rate.",
      id: "actualTfr",
      kind: "number",
      label: "Actual TFR",
      minimum: 0,
    },
    {
      description: "Wanted total fertility rate from the survey responses.",
      id: "wantedTfr",
      kind: "number",
      label: "Wanted TFR",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Actual minus wanted total fertility; negative when women bear fewer children than wanted.",
      id: "fertilityGap",
      kind: "number",
      label: "Gap",
    },
    {
      description: "Excess fertility as a percent of observed fertility.",
      id: "unwantedSharePercent",
      kind: "number",
      label: "Unwanted %",
    },
  ],
  calculate: (input) =>
    calculateWantedVsActualFertilityGap(
      input as unknown as WantedVsActualFertilityGapInput,
    ),
});

export const runWantedVsActualFertilityGap =
  wantedVsActualFertilityGapTool.execute;
export default wantedVsActualFertilityGapTool;
