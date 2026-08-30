import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MasonryBlockCoursingHeightInput = Readonly<{
  readonly blockHeightMillimeters: number;
  readonly bedJointMillimeters: number;
  readonly courseCount: number;
}>;
export type MasonryBlockCoursingHeightOutput = Readonly<{
  readonly totalHeightMillimeters: number;
}>;

export const calculateMasonryBlockCoursingHeight = (
  x: MasonryBlockCoursingHeightInput,
): MasonryBlockCoursingHeightOutput => {
  if (
    !Number.isFinite(x.blockHeightMillimeters) ||
    x.blockHeightMillimeters < 0
  )
    simpleError(
      "blockHeightMillimeters",
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
    (x.blockHeightMillimeters + x.bedJointMillimeters) * x.courseCount;
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
    blockHeightMillimeters: 190,
    bedJointMillimeters: 10,
    courseCount: 10,
  },
  output: { totalHeightMillimeters: 2000 },
} satisfies ToolExample<
  MasonryBlockCoursingHeightInput,
  MasonryBlockCoursingHeightOutput
>;

export const tool = createSimpleTool({
  id: "construction/masonry-block-coursing-height",
  title: "Masonry Block Coursing Height",
  description:
    "Total nominal masonry block-course height from block height plus bed-joint thickness per course.",
  inputs: [
    {
      id: "blockHeightMillimeters",
      kind: "number",
      label: "Block Height Millimeters",
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
    calculateMasonryBlockCoursingHeight({
      blockHeightMillimeters: input.blockHeightMillimeters as number,
      bedJointMillimeters: input.bedJointMillimeters as number,
      courseCount: input.courseCount as number,
    }),
});
export const masonryBlockCoursingHeightTool = tool;
export const runMasonryBlockCoursingHeight = tool.execute;
export default tool;
