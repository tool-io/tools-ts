import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RoomVolumeFromDimensionsInput = Readonly<{
  readonly lengthMeters: number;
  readonly widthMeters: number;
  readonly heightMeters: number;
}>;
export type RoomVolumeFromDimensionsOutput = Readonly<{
  readonly cubicMeters: number;
}>;

export const calculateRoomVolumeFromDimensions = (
  x: RoomVolumeFromDimensionsInput,
): RoomVolumeFromDimensionsOutput => {
  if (!Number.isFinite(x.lengthMeters) || x.lengthMeters <= 0)
    simpleError("lengthMeters", "Provide a finite positive number.");
  if (!Number.isFinite(x.widthMeters) || x.widthMeters <= 0)
    simpleError("widthMeters", "Provide a finite positive number.");
  if (!Number.isFinite(x.heightMeters) || x.heightMeters <= 0)
    simpleError("heightMeters", "Provide a finite positive number.");
  const cubicMeters = x.lengthMeters * x.widthMeters * x.heightMeters;
  if (!Number.isFinite(cubicMeters))
    simpleError(
      "cubicMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { cubicMeters: Object.is(cubicMeters, -0) ? 0 : cubicMeters };
};

export const example = {
  input: {
    lengthMeters: 5,
    widthMeters: 4,
    heightMeters: 3,
  },
  output: { cubicMeters: 60 },
} satisfies ToolExample<
  RoomVolumeFromDimensionsInput,
  RoomVolumeFromDimensionsOutput
>;

export const tool = createSimpleTool({
  id: "acoustics/room-volume-from-dimensions",
  title: "Room Volume From Dimensions",
  description:
    "Rectangular room volume from internal length, width and height.",
  inputs: [
    {
      id: "lengthMeters",
      kind: "number",
      label: "Length Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "widthMeters",
      kind: "number",
      label: "Width Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "heightMeters",
      kind: "number",
      label: "Height Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "cubicMeters", kind: "number", label: "Cubic Meters", unit: "m3" },
  ],
  calculate: (input) =>
    calculateRoomVolumeFromDimensions({
      lengthMeters: input.lengthMeters as number,
      widthMeters: input.widthMeters as number,
      heightMeters: input.heightMeters as number,
    }),
});
export const roomVolumeFromDimensionsTool = tool;
export const runRoomVolumeFromDimensions = tool.execute;
export default tool;
