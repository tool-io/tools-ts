import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type MagneticCourseInput = {
  readonly trueCourseDeg: number;
  readonly variationDeg: number;
};

export type MagneticCourseOutput = {
  readonly magneticCourseDeg: number;
};

const norm = (value: number): number => ((value % 360) + 360) % 360;

export const magneticCourseExample = {
  input: { trueCourseDeg: 5, variationDeg: 15 },
} satisfies ToolExample<MagneticCourseInput>;

export const magneticCourseTool = createSimpleTool({
  id: "aviation/magnetic-course",
  title: "Magnetic Course Calculator",
  description:
    "Convert a true course to a magnetic course by subtracting the magnetic variation, east positive.",
  inputs: [
    {
      description: "Magnetic variation; east is positive.",
      id: "variationDeg",
      label: "Variation",
      kind: "number",
      maximum: 180,
      minimum: -180,
      unit: "°",
    },
    { id: "trueCourseDeg", label: "True course", kind: "number", unit: "°" },
  ],
  outputs: [
    {
      id: "magneticCourseDeg",
      label: "Magnetic course",
      kind: "number",
      unit: "°",
    },
  ],
  calculate: (input) => ({
    magneticCourseDeg: norm(
      (input.trueCourseDeg as number) - (input.variationDeg as number),
    ),
  }),
});
export const runMagneticCourse = magneticCourseTool.execute;
export default magneticCourseTool;
