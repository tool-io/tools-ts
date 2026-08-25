import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DeadReckoningPositionInput = {
  readonly courseDeg: number;
  readonly distanceNm: number;
  readonly startLatitudeDeg: number;
  readonly startLongitudeDeg: number;
};

export type DeadReckoningPositionOutput = {
  readonly latitudeDeg: number;
  readonly longitudeDeg: number;
};

export const deadReckoningPositionExample = {
  input: {
    courseDeg: 90,
    distanceNm: 60,
    startLatitudeDeg: 40,
    startLongitudeDeg: -74,
  },
  output: { latitudeDeg: 40, longitudeDeg: -72.69459271066773 },
} satisfies ToolExample<
  DeadReckoningPositionInput,
  DeadReckoningPositionOutput
>;

export const deadReckoningPositionTool = createSimpleTool({
  id: "sailing/dead-reckoning-position",
  title: "Dead Reckoning Position Calculator",
  description:
    "Project a dead reckoning position from a start coordinate, course, and distance traveled.",
  inputs: [
    {
      id: "startLatitudeDeg",
      kind: "number",
      label: "Start latitude",
      maximum: 90,
      minimum: -90,
    },
    {
      id: "startLongitudeDeg",
      kind: "number",
      label: "Start longitude",
      maximum: 180,
      minimum: -180,
    },
    {
      id: "courseDeg",
      kind: "number",
      label: "Course",
      maximum: 360,
      minimum: 0,
    },
    { id: "distanceNm", kind: "number", label: "Distance", minimum: 0 },
  ],
  outputs: [
    { id: "latitudeDeg", kind: "number", label: "Latitude" },
    { id: "longitudeDeg", kind: "number", label: "Longitude" },
  ],
  calculate: (input) => {
    const toRad = Math.PI / 180;
    const distance = input.distanceNm as number;
    if (distance < 0) simpleError("distanceNm", "Distance cannot be negative.");
    const startLatitudeDeg = input.startLatitudeDeg as number;
    const deltaLatitudeDeg =
      (distance * Math.cos((input.courseDeg as number) * toRad)) / 60;
    const midLatitudeDeg = startLatitudeDeg + deltaLatitudeDeg / 2;
    if (Math.abs(midLatitudeDeg) >= 89.5)
      simpleError(
        "",
        "Mid-course latitude is within the polar computation limit.",
        "polar_limit",
      );
    const deltaLongitudeDeg =
      (distance * Math.sin((input.courseDeg as number) * toRad)) /
      (60 * Math.cos(midLatitudeDeg * toRad));
    const latitudeDeg = startLatitudeDeg + deltaLatitudeDeg;
    if (Math.abs(latitudeDeg) > 90)
      simpleError(
        "distanceNm",
        "The projected track crosses a pole, which this plane-sailing calculation cannot represent.",
        "polar_limit",
      );
    const unnormalizedLongitude =
      (input.startLongitudeDeg as number) + deltaLongitudeDeg;
    return {
      latitudeDeg,
      longitudeDeg: ((unnormalizedLongitude + 540) % 360) - 180,
    };
  },
});
export const runDeadReckoningPosition = deadReckoningPositionTool.execute;
export default deadReckoningPositionTool;
