import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CrossTrackErrorInput = {
  readonly bearingFromStartDeg: number;
  readonly desiredCourseDeg: number;
  readonly distanceFromStartNm: number;
};

export type CrossTrackErrorOutput = {
  readonly crossTrackErrorNm: number;
};

export const crossTrackErrorExample = {
  input: {
    bearingFromStartDeg: 15,
    desiredCourseDeg: 0,
    distanceFromStartNm: 10,
  },
  output: { crossTrackErrorNm: 2.5881904510252074 },
} satisfies ToolExample<CrossTrackErrorInput, CrossTrackErrorOutput>;

export const crossTrackErrorTool = createSimpleTool({
  id: "sailing/cross-track-error",
  title: "Cross Track Error Calculator",
  description:
    "Calculate the signed perpendicular distance from a desired course given distance run and the bearing back to the start point.",
  inputs: [
    {
      id: "distanceFromStartNm",
      kind: "number",
      label: "Distance from start",
      minimum: 0,
    },
    {
      id: "bearingFromStartDeg",
      kind: "number",
      label: "Bearing from start",
    },
    { id: "desiredCourseDeg", kind: "number", label: "Desired course" },
  ],
  outputs: [
    {
      id: "crossTrackErrorNm",
      kind: "number",
      label: "Cross track error",
    },
  ],
  calculate: (input) => {
    const distance = input.distanceFromStartNm as number;
    if (distance < 0)
      simpleError(
        "distanceFromStartNm",
        "Distance from start cannot be negative.",
      );
    return {
      crossTrackErrorNm:
        distance *
        Math.sin(
          ((input.bearingFromStartDeg as number) -
            (input.desiredCourseDeg as number)) *
            (Math.PI / 180),
        ),
    };
  },
});
export const runCrossTrackError = crossTrackErrorTool.execute;
export default crossTrackErrorTool;
