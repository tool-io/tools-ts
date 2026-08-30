import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FloorLevelingCompoundVolumeInput = Readonly<{
  readonly areaSquareMeters: number;
  readonly averageDepthMillimeters: number;
}>;
export type FloorLevelingCompoundVolumeOutput = Readonly<{
  readonly volumeLiters: number;
}>;

export const calculateFloorLevelingCompoundVolume = (
  x: FloorLevelingCompoundVolumeInput,
): FloorLevelingCompoundVolumeOutput => {
  if (!Number.isFinite(x.areaSquareMeters) || x.areaSquareMeters < 0)
    simpleError("areaSquareMeters", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.averageDepthMillimeters) ||
    x.averageDepthMillimeters < 0
  )
    simpleError(
      "averageDepthMillimeters",
      "Provide a finite number at least 0.",
    );
  const volumeLiters = x.areaSquareMeters * x.averageDepthMillimeters;
  if (!Number.isFinite(volumeLiters))
    simpleError(
      "volumeLiters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { volumeLiters: Object.is(volumeLiters, -0) ? 0 : volumeLiters };
};

export const example = {
  input: { areaSquareMeters: 20, averageDepthMillimeters: 5 },
  output: { volumeLiters: 100 },
} satisfies ToolExample<
  FloorLevelingCompoundVolumeInput,
  FloorLevelingCompoundVolumeOutput
>;

export const tool = createSimpleTool({
  id: "construction/floor-leveling-compound-volume",
  title: "Floor Leveling Compound Volume",
  description:
    "Leveling-compound wet volume from floor area and average applied depth; product yield and shrinkage are separate.",
  inputs: [
    {
      id: "areaSquareMeters",
      kind: "number",
      label: "Area Square Meters",
      unit: "m²",
      minimum: 0,
    },
    {
      id: "averageDepthMillimeters",
      kind: "number",
      label: "Average Depth Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "volumeLiters", kind: "number", label: "Volume Liters", unit: "L" },
  ],
  calculate: (input) =>
    calculateFloorLevelingCompoundVolume({
      areaSquareMeters: input.areaSquareMeters as number,
      averageDepthMillimeters: input.averageDepthMillimeters as number,
    }),
});
export const floorLevelingCompoundVolumeTool = tool;
export const runFloorLevelingCompoundVolume = tool.execute;
export default tool;
