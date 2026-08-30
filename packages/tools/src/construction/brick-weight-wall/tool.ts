import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BrickWeightWallInput = Readonly<{
  readonly brickCount: number;
  readonly massPerBrickKg: number;
  readonly mortarVolumeM3: number;
  readonly mortarDensityKgPerM3: number;
}>;
export type BrickWeightWallOutput = Readonly<{
  readonly wallMassKg: number;
}>;

export const calculateBrickWeightWall = (
  x: BrickWeightWallInput,
): BrickWeightWallOutput => {
  if (!Number.isSafeInteger(x.brickCount) || x.brickCount < 0)
    simpleError("brickCount", "Provide a safe integer at least 0.");
  if (!Number.isFinite(x.massPerBrickKg) || x.massPerBrickKg < 0)
    simpleError("massPerBrickKg", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.mortarVolumeM3) || x.mortarVolumeM3 < 0)
    simpleError("mortarVolumeM3", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.mortarDensityKgPerM3) || x.mortarDensityKgPerM3 < 0)
    simpleError("mortarDensityKgPerM3", "Provide a finite number at least 0.");
  const wallMassKg =
    x.brickCount * x.massPerBrickKg + x.mortarVolumeM3 * x.mortarDensityKgPerM3;
  if (!Number.isFinite(wallMassKg))
    simpleError("wallMassKg", "The inputs produce an invalid result.");
  return { wallMassKg: Object.is(wallMassKg, -0) ? 0 : wallMassKg };
};

export const example = {
  input: {
    brickCount: 100,
    massPerBrickKg: 2,
    mortarVolumeM3: 0.05,
    mortarDensityKgPerM3: 2000,
  },
  output: { wallMassKg: 300 },
} satisfies ToolExample<BrickWeightWallInput, BrickWeightWallOutput>;

export const tool = createSimpleTool({
  id: "construction/brick-weight-wall",
  title: "Brick Wall Weight",
  description:
    "Estimate brick-wall mass from brick count and mortar volume using the supplied material masses and density.",
  inputs: [
    { id: "brickCount", kind: "integer", label: "Bricks", minimum: 0 },
    {
      id: "massPerBrickKg",
      kind: "number",
      label: "Mass per brick",
      unit: "kg",
      minimum: 0,
    },
    {
      id: "mortarVolumeM3",
      kind: "number",
      label: "Mortar volume",
      unit: "m³",
      minimum: 0,
    },
    {
      id: "mortarDensityKgPerM3",
      kind: "number",
      label: "Mortar density",
      unit: "kg/m³",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "wallMassKg", kind: "number", label: "Wall mass", unit: "kg" },
  ],
  calculate: (input) =>
    calculateBrickWeightWall({
      brickCount: input.brickCount as number,
      massPerBrickKg: input.massPerBrickKg as number,
      mortarVolumeM3: input.mortarVolumeM3 as number,
      mortarDensityKgPerM3: input.mortarDensityKgPerM3 as number,
    }),
});
export const brickWeightWallTool = tool;
export const runBrickWeightWall = tool.execute;
export default tool;
