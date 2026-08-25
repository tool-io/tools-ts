import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AndersonTurnDirection = "port" | "starboard";

export type AndersonTurnCourseInput = {
  readonly courseDeg: number;
  readonly turnDirection: AndersonTurnDirection;
};

export type AndersonTurnCourseOutput = {
  readonly andersonTurnCourseDeg: number;
};

const ANDERSON_HEADING_CHANGE_DEG = 240;

const DIRECTION_SIGNS: Record<AndersonTurnDirection, number> = {
  port: -1,
  starboard: 1,
};

const normalizeDegrees = (value: number): number => ((value % 360) + 360) % 360;

export const calculateAndersonTurnCourse = (
  input: AndersonTurnCourseInput,
): AndersonTurnCourseOutput | null =>
  Number.isFinite(input.courseDeg) &&
  input.courseDeg >= 0 &&
  input.courseDeg <= 360
    ? {
        andersonTurnCourseDeg: normalizeDegrees(
          input.courseDeg +
            ANDERSON_HEADING_CHANGE_DEG * DIRECTION_SIGNS[input.turnDirection],
        ),
      }
    : null;

export const andersonTurnCourseExample = {
  input: { courseDeg: 0, turnDirection: "starboard" },
  output: { andersonTurnCourseDeg: 240 },
} satisfies ToolExample<AndersonTurnCourseInput, AndersonTurnCourseOutput>;

export const andersonTurnCourseTool = createSimpleTool({
  id: "sailing/anderson-turn-course",
  title: "Anderson Turn Course",
  description:
    "Calculate the return course reached by an Anderson turn, which rotates the heading two hundred forty degrees toward the chosen turn direction to bring the vessel back along its original track.",
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
      description:
        "Return course flown after the two hundred forty degree turn.",
      format: "course-deg",
      id: "andersonTurnCourseDeg",
      kind: "number",
      label: "Anderson turn course",
      unit: "\u00B0",
    },
  ],
  calculate: (input) => {
    const andersonTurnCourseDeg = calculateAndersonTurnCourse(
      input as unknown as AndersonTurnCourseInput,
    );
    if (andersonTurnCourseDeg === null)
      simpleError(
        "courseDeg",
        "Enter a course between 0 and 360 degrees.",
        "invalid_course",
      );
    return andersonTurnCourseDeg;
  },
});

export const runAndersonTurnCourse = andersonTurnCourseTool.execute;
export default andersonTurnCourseTool;
