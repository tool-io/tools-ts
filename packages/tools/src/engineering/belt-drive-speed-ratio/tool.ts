import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BeltDriveSpeedRatioInput = Readonly<{
  readonly driverDiameterMillimeters: number;
  readonly drivenDiameterMillimeters: number;
}>;
export type BeltDriveSpeedRatioOutput = Readonly<{
  readonly speedRatio: number;
}>;

export const calculateBeltDriveSpeedRatio = (
  x: BeltDriveSpeedRatioInput,
): BeltDriveSpeedRatioOutput => {
  if (
    !Number.isFinite(x.driverDiameterMillimeters) ||
    x.driverDiameterMillimeters < 0
  )
    simpleError(
      "driverDiameterMillimeters",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.drivenDiameterMillimeters) ||
    x.drivenDiameterMillimeters < 0
  )
    simpleError(
      "drivenDiameterMillimeters",
      "Provide a finite number at least 0.",
    );
  const speedRatio = x.driverDiameterMillimeters / x.drivenDiameterMillimeters;
  if (!Number.isFinite(speedRatio))
    simpleError(
      "speedRatio",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { speedRatio: Object.is(speedRatio, -0) ? 0 : speedRatio };
};

export const example = {
  input: { driverDiameterMillimeters: 100, drivenDiameterMillimeters: 200 },
  output: { speedRatio: 0.5 },
} satisfies ToolExample<BeltDriveSpeedRatioInput, BeltDriveSpeedRatioOutput>;

export const tool = createSimpleTool({
  id: "engineering/belt-drive-speed-ratio",
  title: "Belt Drive Speed Ratio",
  description:
    "Ideal no-slip driven-to-driver pulley speed ratio from pitch diameters.",
  inputs: [
    {
      id: "driverDiameterMillimeters",
      kind: "number",
      label: "Driver Diameter Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "drivenDiameterMillimeters",
      kind: "number",
      label: "Driven Diameter Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [{ id: "speedRatio", kind: "number", label: "Speed Ratio" }],
  calculate: (input) =>
    calculateBeltDriveSpeedRatio({
      driverDiameterMillimeters: input.driverDiameterMillimeters as number,
      drivenDiameterMillimeters: input.drivenDiameterMillimeters as number,
    }),
});
export const beltDriveSpeedRatioTool = tool;
export const runBeltDriveSpeedRatio = tool.execute;
export default tool;
