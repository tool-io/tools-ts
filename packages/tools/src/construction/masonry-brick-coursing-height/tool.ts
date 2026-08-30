import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MasonryBrickCoursingHeightInput = Readonly<{
  readonly brickHeightMillimeters: number;
  readonly bedJointMillimeters: number;
  readonly courseCount: number;
}>;
export type MasonryBrickCoursingHeightOutput = Readonly<{
  readonly totalHeightMillimeters: number;
}>;

export const calculateMasonryBrickCoursingHeight = (
  x: MasonryBrickCoursingHeightInput,
): MasonryBrickCoursingHeightOutput => {
  if (
    !Number.isFinite(x.brickHeightMillimeters) ||
    x.brickHeightMillimeters < 0
  )
    simpleError(
      "brickHeightMillimeters",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.bedJointMillimeters) || x.bedJointMillimeters < 0)
    simpleError("bedJointMillimeters", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.courseCount) ||
    !Number.isSafeInteger(x.courseCount) ||
    x.courseCount < 0
  )
    simpleError("courseCount", "Provide a safe integer at least 0.");
  if (!Number.isSafeInteger(x.courseCount))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const totalHeightMillimeters =
    (x.brickHeightMillimeters + x.bedJointMillimeters) * x.courseCount;
  if (!Number.isFinite(totalHeightMillimeters))
    simpleError(
      "totalHeightMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    totalHeightMillimeters: Object.is(totalHeightMillimeters, -0)
      ? 0
      : totalHeightMillimeters,
  };
};

export const example = {
  input: {
    brickHeightMillimeters: 65,
    bedJointMillimeters: 10,
    courseCount: 10,
  },
  output: { totalHeightMillimeters: 750 },
} satisfies ToolExample<
  MasonryBrickCoursingHeightInput,
  MasonryBrickCoursingHeightOutput
>;

export const tool = createSimpleTool({
  id: "construction/masonry-brick-coursing-height",
  title: "Masonry Brick Coursing Height",
  description:
    "Total nominal masonry brick-course height from brick height plus horizontal bed-joint thickness per course.",
  inputs: [
    {
      id: "brickHeightMillimeters",
      kind: "number",
      label: "Brick Height Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "bedJointMillimeters",
      kind: "number",
      label: "Bed Joint Millimeters",
      unit: "mm",
      minimum: 0,
    },
    { id: "courseCount", kind: "integer", label: "Course Count", minimum: 0 },
  ],
  outputs: [
    {
      id: "totalHeightMillimeters",
      kind: "number",
      label: "Total Height Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateMasonryBrickCoursingHeight({
      brickHeightMillimeters: input.brickHeightMillimeters as number,
      bedJointMillimeters: input.bedJointMillimeters as number,
      courseCount: input.courseCount as number,
    }),
});
export const masonryBrickCoursingHeightTool = tool;
export const runMasonryBrickCoursingHeight = tool.execute;
export default tool;
