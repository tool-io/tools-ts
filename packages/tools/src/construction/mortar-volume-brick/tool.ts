import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MortarVolumeBrickInput = Readonly<{
  readonly netWallVolumeM3: number;
  readonly brickCount: number;
  readonly physicalVolumePerBrickM3: number;
}>;
export type MortarVolumeBrickOutput = Readonly<{
  readonly mortarVolumeM3: number;
}>;

export const calculateMortarVolumeBrick = (
  x: MortarVolumeBrickInput,
): MortarVolumeBrickOutput => {
  if (!Number.isFinite(x.netWallVolumeM3) || x.netWallVolumeM3 < 0)
    simpleError("netWallVolumeM3", "Provide a finite number at least 0.");
  if (!Number.isSafeInteger(x.brickCount) || x.brickCount < 0)
    simpleError("brickCount", "Provide a safe integer at least 0.");
  if (
    !Number.isFinite(x.physicalVolumePerBrickM3) ||
    x.physicalVolumePerBrickM3 < 0
  )
    simpleError(
      "physicalVolumePerBrickM3",
      "Provide a finite number at least 0.",
    );
  if (!(x.netWallVolumeM3 >= x.brickCount * x.physicalVolumePerBrickM3))
    simpleError("netWallVolumeM3", "Wall volume must cover the bricks.");
  const mortarVolumeM3 =
    x.netWallVolumeM3 - x.brickCount * x.physicalVolumePerBrickM3;
  if (!Number.isFinite(mortarVolumeM3))
    simpleError("mortarVolumeM3", "The inputs produce an invalid result.");
  return { mortarVolumeM3: Object.is(mortarVolumeM3, -0) ? 0 : mortarVolumeM3 };
};

export const example = {
  input: {
    netWallVolumeM3: 1,
    brickCount: 100,
    physicalVolumePerBrickM3: 0.005,
  },
  output: { mortarVolumeM3: 0.5 },
} satisfies ToolExample<MortarVolumeBrickInput, MortarVolumeBrickOutput>;

export const tool = createSimpleTool({
  id: "construction/mortar-volume-brick",
  title: "Mortar Volume Brick",
  description:
    "Estimate fresh mortar as gross brick-wall volume minus the physical volume of installed bricks; openings must already be deducted.",
  inputs: [
    {
      id: "netWallVolumeM3",
      kind: "number",
      label: "Gross masonry volume after openings",
      unit: "m³",
      minimum: 0,
    },
    {
      id: "brickCount",
      kind: "integer",
      label: "Installed bricks",
      minimum: 0,
    },
    {
      id: "physicalVolumePerBrickM3",
      kind: "number",
      label: "Physical volume per brick",
      unit: "m³",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "mortarVolumeM3",
      kind: "number",
      label: "Mortar volume",
      unit: "m³",
    },
  ],
  calculate: (input) =>
    calculateMortarVolumeBrick({
      netWallVolumeM3: input.netWallVolumeM3 as number,
      brickCount: input.brickCount as number,
      physicalVolumePerBrickM3: input.physicalVolumePerBrickM3 as number,
    }),
});
export const mortarVolumeBrickTool = tool;
export const runMortarVolumeBrick = tool.execute;
export default tool;
