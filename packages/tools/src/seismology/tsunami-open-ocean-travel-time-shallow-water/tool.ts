import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const tsunamiOpenOceanTravelTimeShallowWaterExample = {
  input: { distanceKm: 4000, oceanDepthM: 4000 },
  output: {
    travelTimeHours: 5.609097526068359,
    waveSpeedMS: 198.09088823063013,
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const tsunamiOpenOceanTravelTimeShallowWaterTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ distanceKm, oceanDepthM }) => {
      if (oceanDepthM <= 0)
        simpleError("oceanDepthM", "Depth must be positive.");
      const waveSpeedMS = Math.sqrt(9.81 * oceanDepthM);
      return {
        travelTimeHours: (distanceKm * 1000) / waveSpeedMS / 3600,
        waveSpeedMS,
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Long-wave travel time t = R/√(g·h) across a uniform-depth ocean.",
  id: "seismology/tsunami-open-ocean-travel-time-shallow-water",
  inputs: [
    {
      minimum: 0,
      description: "Great-circle distance.",
      id: "distanceKm",
      kind: "number",
      label: "R",
      unit: "km",
    },
    {
      minimum: 0,
      description: "Mean ocean depth.",
      id: "oceanDepthM",
      kind: "number",
      label: "h",
      unit: "m",
    },
  ],
  outputs: [
    {
      description: "Travel time.",
      id: "travelTimeHours",
      kind: "number",
      label: "t",
      unit: "h",
    },
    {
      description: "Long-wave celerity √(gh).",
      id: "waveSpeedMS",
      kind: "number",
      label: "c",
      unit: "m/s",
    },
  ],
  title: "Tsunami Open Ocean Travel Time Shallow Water Calculator",
});
export const runTsunamiOpenOceanTravelTimeShallowWater =
  tsunamiOpenOceanTravelTimeShallowWaterTool.execute;
export { tsunamiOpenOceanTravelTimeShallowWaterExample as example };
export default tsunamiOpenOceanTravelTimeShallowWaterTool;
