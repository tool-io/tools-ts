import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const sonarRangeEquationExample = {
  input: { twoWayTravelSeconds: 2 },
} satisfies ToolExample<{
  readonly soundSpeedMsPerS?: number;
  readonly twoWayTravelSeconds: number;
}>;

export const sonarRangeEquationTool = createSimpleTool({
  id: "electronics/sonar-range-equation",
  title: "Sonar Range Meters",
  description:
    "Convert a measured two-way echo travel time into distance as rangeMeters = soundSpeedMsPerS * twoWayTravelSeconds / 2, defaulting to 1480 m/s in water.",
  inputs: [
    {
      description: "Time between transmit and echo arrival.",
      id: "twoWayTravelSeconds",
      kind: "number",
      label: "Two-Way Travel",
      unit: "s",
    },
    {
      default: 1480,
      description:
        "Speed of sound in the medium; fresh water is near 1480 m/s.",
      id: "soundSpeedMsPerS",
      kind: "number",
      label: "Sound Speed",
      required: false,
      unit: "m/s",
    },
  ],
  outputs: [
    {
      description: "One-way range to the reflector.",
      id: "sonarRangeMeters",
      kind: "number",
      label: "Range",
      unit: "m",
    },
  ],
  calculate: (input) => {
    const twoWayTravelSeconds = input.twoWayTravelSeconds as number;
    const soundSpeedMsPerS = input.soundSpeedMsPerS as number;
    if (!(twoWayTravelSeconds > 0))
      simpleError(
        "twoWayTravelSeconds",
        "Two-way travel time must be positive.",
      );
    if (!(soundSpeedMsPerS > 0))
      simpleError("soundSpeedMsPerS", "Sound speed must be positive.");
    return { sonarRangeMeters: (soundSpeedMsPerS * twoWayTravelSeconds) / 2 };
  },
});
export const runSonarRangeEquation = sonarRangeEquationTool.execute;
export default sonarRangeEquationTool;
