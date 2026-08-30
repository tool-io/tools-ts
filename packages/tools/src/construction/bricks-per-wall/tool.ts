import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BricksPerWallInput = Readonly<{
  readonly wallFaceAreaM2: number;
  readonly nominalBrickFaceAreaM2: number;
}>;
export type BricksPerWallOutput = Readonly<{
  readonly brickCount: number;
}>;

export const calculateBricksPerWall = (
  x: BricksPerWallInput,
): BricksPerWallOutput => {
  if (!Number.isFinite(x.wallFaceAreaM2) || x.wallFaceAreaM2 < 0)
    simpleError("wallFaceAreaM2", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.nominalBrickFaceAreaM2) ||
    x.nominalBrickFaceAreaM2 < 0
  )
    simpleError(
      "nominalBrickFaceAreaM2",
      "Provide a finite number at least 0.",
    );
  if (!(x.nominalBrickFaceAreaM2 > 0))
    simpleError(
      "nominalBrickFaceAreaM2",
      "Nominal face area must be positive.",
    );
  const brickCount = Math.ceil(x.wallFaceAreaM2 / x.nominalBrickFaceAreaM2);
  if (!Number.isFinite(brickCount) || !Number.isSafeInteger(brickCount))
    simpleError("brickCount", "The inputs produce an invalid result.");
  return { brickCount: Object.is(brickCount, -0) ? 0 : brickCount };
};

export const example = {
  input: { wallFaceAreaM2: 10, nominalBrickFaceAreaM2: 0.02 },
  output: { brickCount: 500 },
} satisfies ToolExample<BricksPerWallInput, BricksPerWallOutput>;

export const tool = createSimpleTool({
  id: "construction/bricks-per-wall",
  title: "Bricks Per Wall",
  description:
    "Round up brick count for net wall face area using the nominal face area of a brick including mortar joints.",
  inputs: [
    {
      id: "wallFaceAreaM2",
      kind: "number",
      label: "Net wall face area",
      unit: "m²",
      minimum: 0,
    },
    {
      id: "nominalBrickFaceAreaM2",
      kind: "number",
      label: "Nominal brick face area",
      unit: "m²",
      minimum: 0,
    },
  ],
  outputs: [{ id: "brickCount", kind: "integer", label: "Bricks required" }],
  calculate: (input) =>
    calculateBricksPerWall({
      wallFaceAreaM2: input.wallFaceAreaM2 as number,
      nominalBrickFaceAreaM2: input.nominalBrickFaceAreaM2 as number,
    }),
});
export const bricksPerWallTool = tool;
export const runBricksPerWall = tool.execute;
export default tool;
