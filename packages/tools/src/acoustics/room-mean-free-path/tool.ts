import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RoomMeanFreePathInput = Readonly<{
  readonly roomCubicMeters: number;
  readonly totalSurfaceSquareMeters: number;
}>;
export type RoomMeanFreePathOutput = Readonly<{
  readonly meanFreePathMeters: number;
}>;

export const calculateRoomMeanFreePath = (
  x: RoomMeanFreePathInput,
): RoomMeanFreePathOutput => {
  if (!Number.isFinite(x.roomCubicMeters) || x.roomCubicMeters <= 0)
    simpleError("roomCubicMeters", "Provide a finite positive number.");
  if (
    !Number.isFinite(x.totalSurfaceSquareMeters) ||
    x.totalSurfaceSquareMeters <= 0
  )
    simpleError(
      "totalSurfaceSquareMeters",
      "Provide a finite positive number.",
    );
  const meanFreePathMeters =
    (4 * x.roomCubicMeters) / x.totalSurfaceSquareMeters;
  if (!Number.isFinite(meanFreePathMeters))
    simpleError(
      "meanFreePathMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    meanFreePathMeters: Object.is(meanFreePathMeters, -0)
      ? 0
      : meanFreePathMeters,
  };
};

export const example = {
  input: {
    roomCubicMeters: 100,
    totalSurfaceSquareMeters: 120,
  },
  output: { meanFreePathMeters: 3.3333333333333335 },
} satisfies ToolExample<RoomMeanFreePathInput, RoomMeanFreePathOutput>;

export const tool = createSimpleTool({
  id: "acoustics/room-mean-free-path",
  title: "Room Mean Free Path",
  description:
    "Diffuse-field mean free path 4V/S inside a room from volume and total surface area.",
  inputs: [
    {
      id: "roomCubicMeters",
      kind: "number",
      label: "Room Cubic Meters",
      unit: "m3",
      minimum: 0,
    },
    {
      id: "totalSurfaceSquareMeters",
      kind: "number",
      label: "Total Surface Square Meters",
      unit: "m2",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "meanFreePathMeters",
      kind: "number",
      label: "Mean Free Path Meters",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateRoomMeanFreePath({
      roomCubicMeters: input.roomCubicMeters as number,
      totalSurfaceSquareMeters: input.totalSurfaceSquareMeters as number,
    }),
});
export const roomMeanFreePathTool = tool;
export const runRoomMeanFreePath = tool.execute;
export default tool;
