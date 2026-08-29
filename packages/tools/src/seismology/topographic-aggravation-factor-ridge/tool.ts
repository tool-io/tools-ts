import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const topographicAggravationFactorRidgeExample = {
  input: { slopeAngleDeg: 30, heightRatio: 0.2 },
  output: {
    aggravationFactor: 1.1786666666666668,
    screeningBand: "steep (15–30°)",
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const topographicAggravationFactorRidgeTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ slopeAngleDeg, heightRatio }) => {
      const ft = 1 + 0.67 * (slopeAngleDeg / 45) * heightRatio * 2;
      const band =
        slopeAngleDeg > 30
          ? "very steep (>30°)"
          : slopeAngleDeg > 15
            ? "steep (15–30°)"
            : slopeAngleDeg > 5
              ? "moderate (5–15°)"
              : "gentle (≤5°)";
      return { aggravationFactor: ft, screeningBand: band };
    })(input as never) as Record<string, unknown>,
  description:
    "Illustrative ridge-top ground-motion amplification screen based on slope and height-to-wavelength ratio; it is not a code-prescribed Eurocode 8 factor.",
  id: "seismology/topographic-aggravation-factor-ridge",
  inputs: [
    {
      minimum: 0,
      maximum: 45,
      description: "Average slope angle of the ridge flank.",
      id: "slopeAngleDeg",
      kind: "number",
      label: "θ",
      unit: "°",
    },
    {
      default: 0.2,
      minimum: 0,
      maximum: 0.5,
      description: "Height-to-wavelength ratio.",
      id: "heightRatio",
      kind: "number",
      label: "λ",
    },
  ],
  outputs: [
    {
      description: "Topographic aggravation factor at the crest.",
      id: "aggravationFactor",
      kind: "number",
      label: "F_t",
    },
    {
      description: "Descriptive slope band used by this screening model.",
      id: "screeningBand",
      kind: "string",
      label: "Slope band",
    },
  ],
  title: "Topographic Aggravation Factor Ridge Calculator",
});
export const runTopographicAggravationFactorRidge =
  topographicAggravationFactorRidgeTool.execute;
export { topographicAggravationFactorRidgeExample as example };
export default topographicAggravationFactorRidgeTool;
