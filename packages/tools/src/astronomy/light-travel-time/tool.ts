import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

const SPEED_OF_LIGHT_KM_PER_S = 299_792.458;
const SECONDS_PER_DAY = 86_400;

export const lightTravelTimeTool = createSimpleTool({
  id: "astronomy/light-travel-time",
  title: "Light Travel Time Calculator",
  description:
    "Compute how long light takes to cover a distance in a vacuum, in seconds and days.",
  inputs: [
    {
      description: "Distance the light travels in a vacuum.",
      id: "distanceKm",
      label: "Distance",
      kind: "number",
      minimum: 0,
      unit: "km",
    },
  ],
  outputs: [
    {
      description: "Travel time in seconds.",
      id: "seconds",
      label: "Seconds",
      kind: "number",
      unit: "s",
    },
    {
      description: "Travel time in days.",
      id: "days",
      label: "Days",
      kind: "number",
      unit: "days",
    },
  ],
  calculate: (input) => {
    const seconds = (input.distanceKm as number) / SPEED_OF_LIGHT_KM_PER_S;
    return { seconds, days: seconds / SECONDS_PER_DAY };
  },
});
export const runLightTravelTime = lightTravelTimeTool.execute;
export default lightTravelTimeTool;

export type LightTravelTimeInput = {
  readonly distanceKm: number;
};

export type LightTravelTimeOutput = {
  readonly seconds: number;
  readonly days: number;
};

export const lightTravelTimeExample = {
  input: {
    distanceKm: 1,
  },
  output: {
    seconds: 0.0000033356409519815205,
    days: 3.860695546274908e-11,
  },
} satisfies ToolExample<LightTravelTimeInput, LightTravelTimeOutput>;
