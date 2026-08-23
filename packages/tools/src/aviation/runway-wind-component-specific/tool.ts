import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RunwayWindComponentSpecificInput = {
  readonly runwayHeadingDeg: number;
  readonly windFromDeg: number;
  readonly windSpeedKt: number;
};

export type RunwayWindComponentSpecificOutput = {
  readonly crosswindComponentKt: number;
  readonly headwindComponentKt: number;
};

export const runwayWindComponentSpecificExample = {
  input: { runwayHeadingDeg: 90, windFromDeg: 120, windSpeedKt: 20 },
  output: {
    crosswindComponentKt: 9.999999999999998,
    headwindComponentKt: 17.320508075688775,
  },
} satisfies ToolExample<
  RunwayWindComponentSpecificInput,
  RunwayWindComponentSpecificOutput
>;

export const calculateRunwayWindComponentSpecific = (
  input: RunwayWindComponentSpecificInput,
): RunwayWindComponentSpecificOutput => {
  if (input.runwayHeadingDeg < 0 || input.runwayHeadingDeg > 360)
    simpleError(
      "runwayHeadingDeg",
      "Runway heading must be between 0 and 360 degrees.",
      "out_of_range",
    );
  if (input.windFromDeg < 0 || input.windFromDeg > 360)
    simpleError(
      "windFromDeg",
      "Wind origin must be between 0 and 360 degrees.",
      "out_of_range",
    );
  const thetaRad =
    ((input.windFromDeg - input.runwayHeadingDeg) * Math.PI) / 180;
  return {
    crosswindComponentKt: input.windSpeedKt * Math.sin(thetaRad),
    headwindComponentKt: input.windSpeedKt * Math.cos(thetaRad),
  };
};

export const runwayWindComponentSpecificTool = createSimpleTool({
  calculate: (input) =>
    calculateRunwayWindComponentSpecific({
      runwayHeadingDeg: input.runwayHeadingDeg as number,
      windFromDeg: input.windFromDeg as number,
      windSpeedKt: input.windSpeedKt as number,
    }),
  description:
    "Resolve a reported wind onto a specific runway using theta = windFromDeg - runwayHeadingDeg, headwindComponentKt = windSpeedKt * cos(theta) and crosswindComponentKt = windSpeedKt * sin(theta).",
  id: "aviation/runway-wind-component-specific",
  inputs: [
    {
      description: "Magnetic heading of the runway in use.",
      id: "runwayHeadingDeg",
      kind: "number",
      label: "Runway heading",
      maximum: 360,
      minimum: 0,
      unit: "°",
    },
    {
      description: "Direction the wind is coming from.",
      id: "windFromDeg",
      kind: "number",
      label: "Wind from",
      maximum: 360,
      minimum: 0,
      unit: "°",
    },
    {
      description: "Wind speed.",
      id: "windSpeedKt",
      kind: "number",
      label: "Wind speed",
      minimum: 0,
      unit: "kt",
    },
  ],
  outputs: [
    {
      description:
        "Headwind component along the runway; negative values indicate a tailwind component.",
      id: "headwindComponentKt",
      kind: "number",
      label: "Headwind component",
      unit: "kt",
    },
    {
      description:
        "Crosswind component across the runway; sign indicates the side it comes from.",
      id: "crosswindComponentKt",
      kind: "number",
      label: "Crosswind component",
      unit: "kt",
    },
  ],
  title: "Runway Wind Components",
});
export const runRunwayWindComponentSpecific =
  runwayWindComponentSpecificTool.execute;
export default runwayWindComponentSpecificTool;
