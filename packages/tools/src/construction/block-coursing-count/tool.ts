import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BlockCoursingCountInput = Readonly<{
  readonly wallMillimeters: number;
  readonly blockHeightMillimeters: number;
  readonly bedJointMillimeters: number;
}>;
export type BlockCoursingCountOutput = Readonly<{
  readonly fullCourseCount: number;
}>;

export const calculateBlockCoursingCount = (
  x: BlockCoursingCountInput,
): BlockCoursingCountOutput => {
  if (!Number.isFinite(x.wallMillimeters) || x.wallMillimeters < 0)
    simpleError("wallMillimeters", "Provide a finite number at least 0.");
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
  const fullCourseCount = Math.floor(
    x.wallMillimeters / (x.blockHeightMillimeters + x.bedJointMillimeters),
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
    wallMillimeters: 2000,
    blockHeightMillimeters: 190,
    bedJointMillimeters: 10,
  },
  output: { fullCourseCount: 10 },
} satisfies ToolExample<BlockCoursingCountInput, BlockCoursingCountOutput>;

export const tool = createSimpleTool({
  id: "construction/block-coursing-count",
  title: "Block Coursing Count",
  description:
    "Number of complete block courses that fit a wall height at the specified block-plus-bed-joint course height.",
  inputs: [
    {
      id: "wallMillimeters",
      kind: "number",
      label: "Wall Millimeters",
      unit: "mm",
      minimum: 0,
    },
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
  ],
  outputs: [
    { id: "fullCourseCount", kind: "integer", label: "Full Course Count" },
  ],
  calculate: (input) =>
    calculateBlockCoursingCount({
      wallMillimeters: input.wallMillimeters as number,
      blockHeightMillimeters: input.blockHeightMillimeters as number,
      bedJointMillimeters: input.bedJointMillimeters as number,
    }),
});
export const blockCoursingCountTool = tool;
export const runBlockCoursingCount = tool.execute;
export default tool;
