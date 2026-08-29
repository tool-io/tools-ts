import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const elevationStaticCorrectionReplacementVelocityExample = {
  input: {
    elevationM: 500,
    weatheringVelocityMS: 800,
    replacementVelocityMS: 2400,
  },
  output: { staticCorrectionMs: 416.66666666666663, polarity: "delay (add)" },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const elevationStaticCorrectionReplacementVelocityTool =
  createSimpleTool({
    calculate: (input: Readonly<Record<string, unknown>>) =>
      (({ elevationM, weatheringVelocityMS, replacementVelocityMS }) => {
        if (weatheringVelocityMS <= 0)
          simpleError(
            "weatheringVelocityMS",
            "Weathering velocity must be positive.",
          );
        if (replacementVelocityMS <= weatheringVelocityMS)
          simpleError(
            "replacementVelocityMS",
            "Replacement velocity must exceed the weathering velocity.",
          );
        const seconds =
          elevationM * (1 / weatheringVelocityMS - 1 / replacementVelocityMS);
        return {
          staticCorrectionMs: Math.abs(seconds) * 1000,
          polarity: seconds >= 0 ? "delay (add)" : "advance (subtract)",
        };
      })(input as never) as Record<string, unknown>,
    description:
      "Elevation static from station height above datum using the replacement-velocity method.",
    id: "seismology/elevation-static-correction-replacement-velocity",
    inputs: [
      {
        description: "Station elevation above datum.",
        id: "elevationM",
        kind: "number",
        label: "h_e",
        unit: "m",
      },
      {
        minimum: 0,
        description: "Weathering-layer velocity.",
        id: "weatheringVelocityMS",
        kind: "number",
        label: "V_w",
        unit: "m/s",
      },
      {
        minimum: 0,
        description: "Replacement (datum) velocity.",
        id: "replacementVelocityMS",
        kind: "number",
        label: "V_r",
        unit: "m/s",
      },
    ],
    outputs: [
      {
        description: "Static time shift to apply.",
        id: "staticCorrectionMs",
        kind: "number",
        label: "t_stat",
        unit: "ms",
      },
      {
        description: "Advance or delay convention.",
        id: "polarity",
        kind: "string",
        label: "Polarity",
      },
    ],
    title: "Elevation Static Correction Replacement Velocity Calculator",
  });
export const runElevationStaticCorrectionReplacementVelocity =
  elevationStaticCorrectionReplacementVelocityTool.execute;
export { elevationStaticCorrectionReplacementVelocityExample as example };
export default elevationStaticCorrectionReplacementVelocityTool;
