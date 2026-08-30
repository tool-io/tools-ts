import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BrickCoursingCountInput = Readonly<{
  readonly wallMillimeters: number;
  readonly brickHeightMillimeters: number;
  readonly bedJointMillimeters: number;
}>;
export type BrickCoursingCountOutput = Readonly<{
  readonly fullCourseCount: number;
}>;

export const calculateBrickCoursingCount = (
  x: BrickCoursingCountInput,
): BrickCoursingCountOutput => {
  if (!Number.isFinite(x.wallMillimeters) || x.wallMillimeters < 0)
    simpleError("wallMillimeters", "Provide a finite number at least 0.");
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
  const fullCourseCount = Math.floor(
    x.wallMillimeters / (x.brickHeightMillimeters + x.bedJointMillimeters),
  );
  if (
    !Number.isFinite(fullCourseCount) ||
    !Number.isSafeInteger(fullCourseCount)
  )
    simpleError(
      "fullCourseCount",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    fullCourseCount: Object.is(fullCourseCount, -0) ? 0 : fullCourseCount,
  };
};

export const example = {
  input: {
    wallMillimeters: 750,
    brickHeightMillimeters: 65,
    bedJointMillimeters: 10,
  },
  output: { fullCourseCount: 10 },
} satisfies ToolExample<BrickCoursingCountInput, BrickCoursingCountOutput>;

export const tool = createSimpleTool({
  id: "construction/brick-coursing-count",
  title: "Brick Coursing Count",
  description:
    "Number of complete brick courses that fit a wall height at the specified brick-plus-bed-joint course height.",
  inputs: [
    {
      id: "wallMillimeters",
      kind: "number",
      label: "Wall Millimeters",
      unit: "mm",
      minimum: 0,
    },
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
  ],
  outputs: [
    { id: "fullCourseCount", kind: "integer", label: "Full Course Count" },
  ],
  calculate: (input) =>
    calculateBrickCoursingCount({
      wallMillimeters: input.wallMillimeters as number,
      brickHeightMillimeters: input.brickHeightMillimeters as number,
      bedJointMillimeters: input.bedJointMillimeters as number,
    }),
});
export const brickCoursingCountTool = tool;
export const runBrickCoursingCount = tool.execute;
export default tool;
