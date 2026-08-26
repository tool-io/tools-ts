import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TurnDirection = "port" | "starboard";

export type WilliamsonTurnCourseInput = {
  readonly courseDeg: number;
  readonly turnDirection: TurnDirection;
};

export type WilliamsonTurnCourseOutput = {
  readonly initialTurnHeadingDeg: number;
  readonly reciprocalCourseDeg: number;
};

const WILLIAMSON_HEADING_CHANGE_DEG = 60;

const DIRECTION_SIGNS: Record<TurnDirection, number> = {
  port: -1,
  starboard: 1,
};

const normalizeDegrees = (value: number): number => ((value % 360) + 360) % 360;

export const calculateWilliamsonTurnCourse = (
  input: WilliamsonTurnCourseInput,
): WilliamsonTurnCourseOutput | null =>
  Number.isFinite(input.courseDeg) &&
  input.courseDeg >= 0 &&
  input.courseDeg <= 360 &&
  (input.turnDirection === "port" || input.turnDirection === "starboard")
    ? {
        initialTurnHeadingDeg: normalizeDegrees(
          input.courseDeg +
            WILLIAMSON_HEADING_CHANGE_DEG *
              DIRECTION_SIGNS[input.turnDirection],
        ),
        reciprocalCourseDeg: normalizeDegrees(input.courseDeg + 180),
      }
    : null;

export const williamsonTurnCourseExample = {
  input: { courseDeg: 30, turnDirection: "starboard" },
  output: { initialTurnHeadingDeg: 90, reciprocalCourseDeg: 210 },
} satisfies ToolExample<WilliamsonTurnCourseInput, WilliamsonTurnCourseOutput>;

export const williamsonTurnCourseTool = createSimpleTool({
  id: "sailing/williamson-turn-course",
  title: "Williamson Turn Course",
  description:
    "Calculate the initial sixty-degree heading and final reciprocal course for a Williamson turn. After reaching the initial heading, reverse the rudder and steady on the reciprocal of the original course.",
  inputs: [
    {
      description: "Course at the time of the man overboard incident.",
      id: "courseDeg",
      kind: "number",
      label: "Course",
      unit: "\u00B0",
    },
    {
      description: "Side the vessel turns toward.",
      enum: ["port", "starboard"],
      id: "turnDirection",
      kind: "string",
      label: "Turn direction",
    },
  ],
  outputs: [
    {
      description: "Initial heading at which the rudder is reversed.",
      format: "course-deg",
      id: "initialTurnHeadingDeg",
      kind: "number",
      label: "Initial turn heading",
      unit: "\u00B0",
    },
    {
      description: "Final reciprocal course on which the vessel steadies.",
      format: "course-deg",
      id: "reciprocalCourseDeg",
      kind: "number",
      label: "Reciprocal course",
      unit: "\u00B0",
    },
  ],
  calculate: (input) => {
    const turnCourses = calculateWilliamsonTurnCourse(
      input as unknown as WilliamsonTurnCourseInput,
    );
    if (turnCourses === null)
      simpleError(
        "courseDeg",
        "Enter a course between 0 and 360 degrees.",
        "invalid_course",
      );
    return turnCourses;
  },
});

export const runWilliamsonTurnCourse = williamsonTurnCourseTool.execute;
export default williamsonTurnCourseTool;
