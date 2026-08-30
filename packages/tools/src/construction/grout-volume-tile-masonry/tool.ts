import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GroutVolumeTileMasonryInput = Readonly<{
  readonly filledCellCount: number;
  readonly voidVolumePerCellLiters: number;
}>;
export type GroutVolumeTileMasonryOutput = Readonly<{
  readonly groutVolumeLiters: number;
}>;

export const calculateGroutVolumeTileMasonry = (
  x: GroutVolumeTileMasonryInput,
): GroutVolumeTileMasonryOutput => {
  if (!Number.isSafeInteger(x.filledCellCount) || x.filledCellCount < 0)
    simpleError("filledCellCount", "Provide a safe integer at least 0.");
  if (
    !Number.isFinite(x.voidVolumePerCellLiters) ||
    x.voidVolumePerCellLiters < 0
  )
    simpleError(
      "voidVolumePerCellLiters",
      "Provide a finite number at least 0.",
    );
  const groutVolumeLiters = x.filledCellCount * x.voidVolumePerCellLiters;
  if (!Number.isFinite(groutVolumeLiters))
    simpleError("groutVolumeLiters", "The inputs produce an invalid result.");
  return {
    groutVolumeLiters: Object.is(groutVolumeLiters, -0) ? 0 : groutVolumeLiters,
  };
};

export const example = {
  input: { filledCellCount: 100, voidVolumePerCellLiters: 0.5 },
  output: { groutVolumeLiters: 50 },
} satisfies ToolExample<
  GroutVolumeTileMasonryInput,
  GroutVolumeTileMasonryOutput
>;

export const tool = createSimpleTool({
  id: "construction/grout-volume-tile-masonry",
  title: "Tile Masonry Grout Volume",
  description:
    "Calculate tile-masonry grout volume from count of grout-filled cells and measured void volume per cell.",
  inputs: [
    {
      id: "filledCellCount",
      kind: "integer",
      label: "Filled cells",
      minimum: 0,
    },
    {
      id: "voidVolumePerCellLiters",
      kind: "number",
      label: "Void volume per cell",
      unit: "L",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "groutVolumeLiters",
      kind: "number",
      label: "Grout volume",
      unit: "L",
    },
  ],
  calculate: (input) =>
    calculateGroutVolumeTileMasonry({
      filledCellCount: input.filledCellCount as number,
      voidVolumePerCellLiters: input.voidVolumePerCellLiters as number,
    }),
});
export const groutVolumeTileMasonryTool = tool;
export const runGroutVolumeTileMasonry = tool.execute;
export default tool;
