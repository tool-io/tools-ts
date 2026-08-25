import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const ODOR_INTENSITIES = ["none", "faint", "distinct", "strong"] as const;
type OdorIntensity = (typeof ODOR_INTENSITIES)[number];

const ODOR_RATINGS: Record<OdorIntensity, number> = {
  none: 0,
  faint: 1,
  distinct: 2,
  strong: 3,
};

export type OdorIntensityScaleRaterInput = {
  readonly intensity: OdorIntensity;
};

export type OdorIntensityScaleRaterOutput = {
  readonly intensity: OdorIntensity;
  readonly odorRating: number;
};

export const odorIntensityScaleRaterExample = {
  input: { intensity: "distinct" },
  output: { intensity: "distinct", odorRating: 2 },
} satisfies ToolExample<
  OdorIntensityScaleRaterInput,
  OdorIntensityScaleRaterOutput
>;

export const odorIntensityScaleRaterTool = createSimpleTool({
  id: "mycology/odor-intensity-scale-rater",
  title: "Odor Intensity Rater",
  description:
    "Rate odor intensity on a zero-to-three scale and record the level.",
  inputs: [
    {
      enum: ODOR_INTENSITIES,
      id: "intensity",
      kind: "string",
      label: "Intensity",
    },
  ],
  outputs: [
    {
      enum: ODOR_INTENSITIES,
      id: "intensity",
      kind: "string",
      label: "Intensity",
    },
    {
      id: "odorRating",
      kind: "integer",
      label: "Odor rating",
      maximum: 3,
      minimum: 0,
    },
  ],
  calculate: (input) => {
    const intensity = input.intensity as OdorIntensity;
    const odorRating = ODOR_RATINGS[intensity];
    if (odorRating === undefined)
      simpleError("intensity", "Choose a known odor intensity.");
    return { intensity, odorRating };
  },
});
export const runOdorIntensityScaleRater = odorIntensityScaleRaterTool.execute;
export default odorIntensityScaleRaterTool;
