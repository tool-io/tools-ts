import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RudderAspectRatioInput = {
  readonly depthMeters: number;
  readonly rudderAreaM2: number;
};

export type RudderAspectRatioOutput = {
  readonly rudderAspectRatio: number;
};

export const rudderAspectRatioExample = {
  input: { depthMeters: 1, rudderAreaM2: 0.25 },
  output: { rudderAspectRatio: 4 },
} satisfies ToolExample<RudderAspectRatioInput, RudderAspectRatioOutput>;

export const rudderAspectRatioTool = createSimpleTool({
  calculate: (input) => {
    const depthMeters = input.depthMeters as number;
    const rudderAreaM2 = input.rudderAreaM2 as number;
    if (depthMeters <= 0)
      simpleError(
        "depthMeters",
        "Rudder depth must be positive.",
        "invalid_depth",
      );
    if (rudderAreaM2 <= 0)
      simpleError(
        "rudderAreaM2",
        "Rudder area must be positive.",
        "invalid_area",
      );
    return {
      rudderAspectRatio: (depthMeters * depthMeters) / rudderAreaM2,
    };
  },
  description:
    "Compute the rudder aspect ratio as rudderAspectRatio = depthMeters^2 / rudderAreaM2; high ratio rudders are deep and narrow.",
  id: "sailing/rudder-aspect-ratio",
  inputs: [
    {
      description: "Vertical depth of the rudder blade.",
      id: "depthMeters",
      kind: "number",
      label: "Rudder depth",
      minimum: 0,
      unit: "m",
    },
    {
      description: "Projected area of the rudder blade.",
      id: "rudderAreaM2",
      kind: "number",
      label: "Rudder area",
      minimum: 0,
      unit: "m\u00B2",
    },
  ],
  outputs: [
    {
      description: "Aspect ratio of the rudder planform.",
      format: "ratio",
      id: "rudderAspectRatio",
      kind: "number",
      label: "Rudder aspect ratio",
    },
  ],
  title: "Rudder Aspect Ratio",
});
export const runRudderAspectRatio = rudderAspectRatioTool.execute;
export default rudderAspectRatioTool;
