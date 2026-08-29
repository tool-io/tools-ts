import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const macroseismicWeightedCentroidCalculatorExample = {
  input: { eastingsKm: [0, 10], northingsKm: [0, 10], intensities: [6, 8] },
  output: {
    centroidXKm: 5.714285714285714,
    centroidYKm: 5.714285714285714,
    effectivePoints: 14,
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const macroseismicWeightedCentroidCalculatorTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ eastingsKm, northingsKm, intensities }) => {
      const X = eastingsKm as unknown[];
      const Y = northingsKm as unknown[];
      const I = intensities as unknown[];
      if (
        !Array.isArray(X) ||
        !Array.isArray(Y) ||
        !Array.isArray(I) ||
        X.length !== Y.length ||
        X.length !== I.length ||
        X.length === 0
      )
        simpleError("eastingsKm", "Provide matching non-empty lists.");
      let sw = 0,
        sx = 0,
        sy = 0;
      for (let i = 0; i < X.length; i++) {
        const w = (I as number[])[i];
        if (w < 0)
          simpleError("intensities", "Intensity weights cannot be negative.");
        sw += w;
        sx += w * (X as number[])[i];
        sy += w * (Y as number[])[i];
      }
      if (sw <= 0)
        simpleError("intensities", "Weights must sum to a positive value.");
      return {
        centroidXKm: sx / sw,
        centroidYKm: sy / sw,
        effectivePoints: sw,
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Intensity-weighted centroid of macroseismic observations as a first epicenter proxy.",
  id: "seismology/macroseismic-weighted-centroid-calculator",
  inputs: [
    {
      description: "Observation eastings.",
      id: "eastingsKm",
      kind: "numberList",
      label: "x_i",
    },
    {
      description: "Observation northings.",
      id: "northingsKm",
      kind: "numberList",
      label: "y_i",
    },
    {
      description: "Reported intensities.",
      id: "intensities",
      kind: "numberList",
      label: "I_i",
    },
  ],
  outputs: [
    {
      description: "Weighted centroid easting.",
      id: "centroidXKm",
      kind: "number",
      label: "x̄",
      unit: "km",
    },
    {
      description: "Weighted centroid northing.",
      id: "centroidYKm",
      kind: "number",
      label: "ȳ",
      unit: "km",
    },
    {
      description: "Sum of intensity weights.",
      id: "effectivePoints",
      kind: "number",
      label: "Σw",
    },
  ],
  title: "Macroseismic Weighted Centroid Calculator",
});
export const runMacroseismicWeightedCentroidCalculator =
  macroseismicWeightedCentroidCalculatorTool.execute;
export { macroseismicWeightedCentroidCalculatorExample as example };
export default macroseismicWeightedCentroidCalculatorTool;
