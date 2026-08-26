import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type QuickstopReturnCourseInput = {
  readonly courseDeg: number;
};

export type QuickstopReturnCourseOutput = {
  readonly returnCourseDeg: number;
};

const RECIPROCAL_OFFSET_DEG = 180;

const normalizeDegrees = (value: number): number => ((value % 360) + 360) % 360;

export const calculateQuickstopReturnCourse = (
  input: QuickstopReturnCourseInput,
): QuickstopReturnCourseOutput | null =>
  Number.isFinite(input.courseDeg) &&
  input.courseDeg >= 0 &&
  input.courseDeg <= 360
    ? {
        returnCourseDeg: normalizeDegrees(
          input.courseDeg + RECIPROCAL_OFFSET_DEG,
        ),
      }
    : null;

export const quickstopReturnCourseExample = {
  input: { courseDeg: 90 },
  output: { returnCourseDeg: 270 },
} satisfies ToolExample<
  QuickstopReturnCourseInput,
  QuickstopReturnCourseOutput
>;

export const quickstopReturnCourseTool = createSimpleTool({
  id: "sailing/man-overboard-return-course-quickstop",
  title: "Quickstop Return Course",
  description:
    "Calculate the reciprocal of the course at a man-overboard incident as a planning reference for the return leg. The actual Quickstop maneuver and final approach depend on wind, sea room, and the casualty's observed position.",
  inputs: [
    {
      description: "Course at the time of the man overboard incident.",
      id: "courseDeg",
      kind: "number",
      label: "Course",
      unit: "\u00B0",
    },
  ],
  outputs: [
    {
      description: "Return course steering toward the casualty.",
      format: "course-deg",
      id: "returnCourseDeg",
      kind: "number",
      label: "Return course",
      unit: "\u00B0",
    },
  ],
  calculate: (input) => {
    const returnCourseDeg = calculateQuickstopReturnCourse(
      input as unknown as QuickstopReturnCourseInput,
    );
    if (returnCourseDeg === null)
      simpleError(
        "courseDeg",
        "Enter a course between 0 and 360 degrees.",
        "invalid_course",
      );
    return returnCourseDeg;
  },
});

export const runQuickstopReturnCourse = quickstopReturnCourseTool.execute;
export default quickstopReturnCourseTool;
