import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LincolnPetersenInput = {
  readonly firstCaptureCount: number;
  readonly recapturedCount: number;
  readonly secondCaptureCount: number;
};

export type LincolnPetersenOutput = {
  readonly populationEstimate: number;
};

export const lincolnPetersenExample = {
  input: {
    firstCaptureCount: 50,
    recapturedCount: 10,
    secondCaptureCount: 40,
  },
  output: { populationEstimate: 200 },
} satisfies ToolExample<LincolnPetersenInput, LincolnPetersenOutput>;

export const lincolnPetersenTool = createSimpleTool({
  id: "biology/lincoln-petersen-estimator",
  title: "Lincoln Petersen Estimator",
  description:
    "Estimate population size from two capture sessions with the Lincoln Petersen index.",
  inputs: [
    {
      id: "firstCaptureCount",
      kind: "integer",
      label: "First capture count",
      minimum: 1,
      unit: "individuals",
    },
    {
      id: "recapturedCount",
      kind: "integer",
      label: "Recaptured count",
      unit: "individuals",
    },
    {
      id: "secondCaptureCount",
      kind: "integer",
      label: "Second capture count",
      minimum: 1,
      unit: "individuals",
    },
  ],
  outputs: [
    {
      id: "populationEstimate",
      kind: "number",
      label: "Population estimate",
      unit: "individuals",
    },
  ],
  calculate: (input) => {
    const recapturedCount = input.recapturedCount as number;
    if (recapturedCount < 1)
      simpleError(
        "recapturedCount",
        "At least one individual must be recaptured.",
        "zero_recaptures",
      );
    if (
      recapturedCount > (input.firstCaptureCount as number) ||
      recapturedCount > (input.secondCaptureCount as number)
    )
      simpleError(
        "recapturedCount",
        "Recaptures cannot exceed either capture-session count.",
        "invalid_recaptures",
      );
    return {
      populationEstimate:
        ((input.firstCaptureCount as number) *
          (input.secondCaptureCount as number)) /
        recapturedCount,
    };
  },
});
export const runLincolnPetersen = lincolnPetersenTool.execute;
export default lincolnPetersenTool;
