import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CourseOverGroundInput = {
  readonly currentSetDeg: number;
  readonly currentSpeedKt: number;
  readonly vesselCourseDeg: number;
  readonly vesselSpeedKt: number;
};

export type CourseOverGroundOutput = {
  readonly courseOverGroundDeg: number;
};

export const courseOverGroundExample = {
  input: {
    currentSetDeg: 90,
    currentSpeedKt: 2,
    vesselCourseDeg: 0,
    vesselSpeedKt: 10,
  },
  output: { courseOverGroundDeg: 11.30993247402023 },
} satisfies ToolExample<CourseOverGroundInput, CourseOverGroundOutput>;

export const courseOverGroundTool = createSimpleTool({
  id: "sailing/course-over-ground",
  title: "Course Over Ground Calculator",
  description:
    "Calculate the resulting course over ground from vessel motion combined with current set and drift.",
  inputs: [
    {
      id: "vesselCourseDeg",
      kind: "number",
      label: "Vessel course",
      maximum: 360,
      minimum: 0,
    },
    { id: "vesselSpeedKt", kind: "number", label: "Vessel speed", minimum: 0 },
    {
      id: "currentSetDeg",
      kind: "number",
      label: "Current set",
      maximum: 360,
      minimum: 0,
    },
    {
      id: "currentSpeedKt",
      kind: "number",
      label: "Current speed",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "courseOverGroundDeg", kind: "number", label: "Course over ground" },
  ],
  calculate: (input) => {
    const toRad = Math.PI / 180;
    const east =
      (input.vesselSpeedKt as number) *
        Math.sin((input.vesselCourseDeg as number) * toRad) +
      (input.currentSpeedKt as number) *
        Math.sin((input.currentSetDeg as number) * toRad);
    const north =
      (input.vesselSpeedKt as number) *
        Math.cos((input.vesselCourseDeg as number) * toRad) +
      (input.currentSpeedKt as number) *
        Math.cos((input.currentSetDeg as number) * toRad);
    if (east === 0 && north === 0)
      simpleError(
        "",
        "Vessel and current combine to zero speed over ground.",
        "stationary",
      );
    return {
      courseOverGroundDeg:
        ((Math.atan2(east, north) * 180) / Math.PI + 360) % 360,
    };
  },
});
export const runCourseOverGround = courseOverGroundTool.execute;
export default courseOverGroundTool;
