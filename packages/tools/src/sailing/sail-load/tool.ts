import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SailLoadInput = {
  readonly sailAreaM2: number;
  readonly windSpeedMs: number;
};

export type SailLoadOutput = {
  readonly sailLoadNewtons: number;
};

const AIR_DENSITY_KG_PER_M3 = 1.225;
const SHAPE_FACTOR = 1.2;

export const sailLoadExample = {
  input: { sailAreaM2: 60, windSpeedMs: 15 },
  output: { sailLoadNewtons: 9922.5 },
} satisfies ToolExample<SailLoadInput, SailLoadOutput>;

export const calculateSailLoad = (input: SailLoadInput): SailLoadOutput => {
  if (input.windSpeedMs <= 0)
    simpleError(
      "windSpeedMs",
      "The wind speed must be positive.",
      "invalid_speed",
    );
  if (input.sailAreaM2 <= 0)
    simpleError(
      "sailAreaM2",
      "The sail area must be positive.",
      "invalid_area",
    );
  return {
    sailLoadNewtons:
      0.5 *
      AIR_DENSITY_KG_PER_M3 *
      input.windSpeedMs ** 2 *
      input.sailAreaM2 *
      SHAPE_FACTOR,
  };
};

export const sailLoadTool = createSimpleTool({
  calculate: (input) => calculateSailLoad(input as unknown as SailLoadInput),
  description:
    "Estimate the aerodynamic load on a sail from wind speed and sail area using a flat-plate drag model.",
  id: "sailing/sail-load",
  inputs: [
    {
      description: "True wind speed.",
      id: "windSpeedMs",
      kind: "number",
      label: "Wind speed",
      unit: "m/s",
    },
    {
      description: "Total sail area exposed to the wind.",
      id: "sailAreaM2",
      kind: "number",
      label: "Sail area",
      unit: "m²",
    },
  ],
  outputs: [
    {
      description: "Estimated load on the sail.",
      format: "force",
      id: "sailLoadNewtons",
      kind: "number",
      label: "Sail load",
      unit: "N",
    },
  ],
  title: "Sail Load Calculator",
});
export const runSailLoad = sailLoadTool.execute;
export default sailLoadTool;
