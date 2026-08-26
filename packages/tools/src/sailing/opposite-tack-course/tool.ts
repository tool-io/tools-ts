import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OppositeTackCourseInput = {
  readonly courseDeg: number;
  readonly trueWindFromDeg: number;
};

export type OppositeTackCourseOutput = {
  readonly oppositeTackCourseDeg: number;
};

export const calculateOppositeTackCourse = (
  input: OppositeTackCourseInput,
): number | null =>
  Number.isFinite(input.courseDeg) &&
  Number.isFinite(input.trueWindFromDeg) &&
  input.courseDeg >= 0 &&
  input.courseDeg <= 360 &&
  input.trueWindFromDeg >= 0 &&
  input.trueWindFromDeg <= 360
    ? (((2 * input.trueWindFromDeg - input.courseDeg) % 360) + 360) % 360
    : null;

export const oppositeTackCourseExample = {
  input: { courseDeg: 40, trueWindFromDeg: 0 },
  output: { oppositeTackCourseDeg: 320 },
} satisfies ToolExample<OppositeTackCourseInput, OppositeTackCourseOutput>;

export const oppositeTackCourseTool = createSimpleTool({
  id: "sailing/opposite-tack-course",
  title: "Opposite Tack Course Calculator",
  description:
    "Calculate the corresponding course on the opposite tack by reflecting the current course across the true-wind direction.",
  inputs: [
    { id: "courseDeg", kind: "number", label: "Course", unit: "°" },
    {
      description: "Direction from which the true wind is blowing.",
      id: "trueWindFromDeg",
      kind: "number",
      label: "True wind from",
      maximum: 360,
      minimum: 0,
      unit: "°",
    },
  ],
  outputs: [
    {
      format: "course-deg",
      id: "oppositeTackCourseDeg",
      kind: "number",
      label: "Opposite tack course",
      unit: "°",
    },
  ],
  calculate: (input) => {
    const oppositeTackCourseDeg = calculateOppositeTackCourse(
      input as unknown as OppositeTackCourseInput,
    );
    if (oppositeTackCourseDeg === null)
      simpleError(
        "courseDeg",
        "Enter course and true-wind directions between 0 and 360 degrees.",
        "invalid_course",
      );
    return { oppositeTackCourseDeg };
  },
});

export const runOppositeTackCourse = oppositeTackCourseTool.execute;
export default oppositeTackCourseTool;
