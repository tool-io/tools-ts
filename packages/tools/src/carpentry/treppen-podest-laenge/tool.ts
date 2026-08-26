import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type LandingLengthRuleInput = {
  readonly flightWidthCm: number;
};

export type LandingLengthRuleOutput = {
  readonly landingLengthCm: number;
};

export const landingLengthRuleExample = {
  input: { flightWidthCm: 100 },
  output: { landingLengthCm: 100 },
} satisfies ToolExample<LandingLengthRuleInput, LandingLengthRuleOutput>;

export const landingLengthRuleTool = createSimpleTool({
  id: "carpentry/treppen-podest-laenge",
  title: "Landing Length Rule",
  description:
    "Apply the stair landing rule that a landing must be at least as deep as the stair flight is wide.",
  inputs: [
    {
      description: "Stair flight width in centimeters between 60 and 200.",
      id: "flightWidthCm",
      kind: "number",
      label: "Flight width",
      maximum: 200,
      minimum: 60,
      unit: "cm",
    },
  ],
  outputs: [
    {
      description:
        "Required landing length in centimeters, equal to the flight width.",
      id: "landingLengthCm",
      kind: "number",
      label: "Landing length",
      unit: "cm",
    },
  ],
  calculate: (input) => ({
    landingLengthCm: input.flightWidthCm as number,
  }),
});
export const runLandingLengthRule = landingLengthRuleTool.execute;
export default landingLengthRuleTool;
