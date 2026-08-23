import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type TrueCourseInput = {
  readonly magneticCourseDeg: number;
  readonly variationDeg: number;
};

export type TrueCourseOutput = {
  readonly trueCourseDeg: number;
};

const norm = (value: number): number => ((value % 360) + 360) % 360;

export const trueCourseExample = {
  input: { magneticCourseDeg: 350, variationDeg: 15 },
  output: { trueCourseDeg: 5 },
} satisfies ToolExample<TrueCourseInput, TrueCourseOutput>;

export const calculateTrueCourse = (
  input: TrueCourseInput,
): TrueCourseOutput => ({
  trueCourseDeg: norm(input.magneticCourseDeg + input.variationDeg),
});

export const trueCourseTool = createSimpleTool({
  id: "aviation/true-course",
  title: "True Course Calculator",
  description:
    "Convert a magnetic course to a true course by adding the magnetic variation, east positive.",
  inputs: [
    {
      id: "magneticCourseDeg",
      label: "Magnetic course",
      kind: "number",
      unit: "°",
    },
    {
      description: "Magnetic variation; east is positive.",
      id: "variationDeg",
      label: "Variation",
      kind: "number",
      maximum: 180,
      minimum: -180,
      unit: "°",
    },
  ],
  outputs: [
    { id: "trueCourseDeg", label: "True course", kind: "number", unit: "°" },
  ],
  calculate: (input) =>
    calculateTrueCourse({
      magneticCourseDeg: input.magneticCourseDeg as number,
      variationDeg: input.variationDeg as number,
    }),
});
export const runTrueCourse = trueCourseTool.execute;
export default trueCourseTool;
