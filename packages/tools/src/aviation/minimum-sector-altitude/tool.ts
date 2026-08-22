import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type MinimumSectorAltitudeInput = {
  readonly highestObstacleFt: number;
};

export type MinimumSectorAltitudeOutput = {
  readonly minimumSectorAltitudeFt: number;
};

const ROUNDING_INCREMENT_FT = 100;
const OBSTACLE_CLEARANCE_FT = 1000;

export const minimumSectorAltitudeExample = {
  input: { highestObstacleFt: 8350 },
  output: { minimumSectorAltitudeFt: 9400 },
} satisfies ToolExample<
  MinimumSectorAltitudeInput,
  MinimumSectorAltitudeOutput
>;

export const calculateMinimumSectorAltitude = (
  input: MinimumSectorAltitudeInput,
): MinimumSectorAltitudeOutput => ({
  minimumSectorAltitudeFt:
    Math.ceil(input.highestObstacleFt / ROUNDING_INCREMENT_FT) *
      ROUNDING_INCREMENT_FT +
    OBSTACLE_CLEARANCE_FT,
});

export const minimumSectorAltitudeTool = createSimpleTool({
  calculate: (input) =>
    calculateMinimumSectorAltitude(
      input as unknown as MinimumSectorAltitudeInput,
    ),
  description:
    "Round the highest obstacle up to the next hundred feet and add 1000 feet of clearance.",
  id: "aviation/minimum-sector-altitude",
  inputs: [
    {
      description: "Highest obstacle elevation within the sector.",
      id: "highestObstacleFt",
      kind: "number",
      label: "Highest obstacle",
      minimum: 0,
      unit: "ft",
    },
  ],
  outputs: [
    {
      description:
        "Minimum sector altitude rounded up to the next hundred feet plus clearance.",
      format: "length-ft",
      id: "minimumSectorAltitudeFt",
      kind: "number",
      label: "Minimum sector altitude",
      unit: "ft",
    },
  ],
  title: "Minimum Sector Altitude Calculator",
});
export const runMinimumSectorAltitude = minimumSectorAltitudeTool.execute;
export default minimumSectorAltitudeTool;
