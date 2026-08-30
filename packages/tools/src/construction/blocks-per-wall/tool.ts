import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BlocksPerWallInput = Readonly<{
  readonly wallFaceAreaM2: number;
  readonly nominalBlockFaceAreaM2: number;
}>;
export type BlocksPerWallOutput = Readonly<{
  readonly blockCount: number;
}>;

export const calculateBlocksPerWall = (
  x: BlocksPerWallInput,
): BlocksPerWallOutput => {
  if (!Number.isFinite(x.wallFaceAreaM2) || x.wallFaceAreaM2 < 0)
    simpleError("wallFaceAreaM2", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.nominalBlockFaceAreaM2) ||
    x.nominalBlockFaceAreaM2 < 0
  )
    simpleError(
      "nominalBlockFaceAreaM2",
      "Provide a finite number at least 0.",
    );
  if (!(x.nominalBlockFaceAreaM2 > 0))
    simpleError(
      "nominalBlockFaceAreaM2",
      "Nominal face area must be positive.",
    );
  const blockCount = Math.ceil(x.wallFaceAreaM2 / x.nominalBlockFaceAreaM2);
  if (!Number.isFinite(blockCount) || !Number.isSafeInteger(blockCount))
    simpleError("blockCount", "The inputs produce an invalid result.");
  return { blockCount: Object.is(blockCount, -0) ? 0 : blockCount };
};

export const example = {
  input: { wallFaceAreaM2: 20, nominalBlockFaceAreaM2: 0.08 },
  output: { blockCount: 250 },
} satisfies ToolExample<BlocksPerWallInput, BlocksPerWallOutput>;

export const tool = createSimpleTool({
  id: "construction/blocks-per-wall",
  title: "Blocks Per Wall",
  description:
    "Round up block count from net wall face area and the installed module face area including mortar joints.",
  inputs: [
    {
      id: "wallFaceAreaM2",
      kind: "number",
      label: "Net wall face area",
      unit: "m²",
      minimum: 0,
    },
    {
      id: "nominalBlockFaceAreaM2",
      kind: "number",
      label: "Nominal block face area",
      unit: "m²",
      minimum: 0,
    },
  ],
  outputs: [{ id: "blockCount", kind: "integer", label: "Blocks required" }],
  calculate: (input) =>
    calculateBlocksPerWall({
      wallFaceAreaM2: input.wallFaceAreaM2 as number,
      nominalBlockFaceAreaM2: input.nominalBlockFaceAreaM2 as number,
    }),
});
export const blocksPerWallTool = tool;
export const runBlocksPerWall = tool.execute;
export default tool;
