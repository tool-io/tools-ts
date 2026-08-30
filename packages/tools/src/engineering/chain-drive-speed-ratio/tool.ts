import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ChainDriveSpeedRatioInput = Readonly<{
  readonly driverTeeth: number;
  readonly drivenTeeth: number;
}>;
export type ChainDriveSpeedRatioOutput = Readonly<{
  readonly speedRatio: number;
}>;

export const calculateChainDriveSpeedRatio = (
  x: ChainDriveSpeedRatioInput,
): ChainDriveSpeedRatioOutput => {
  if (!Number.isFinite(x.driverTeeth) || x.driverTeeth < 1)
    simpleError("driverTeeth", "Provide a positive integer.");
  if (!Number.isFinite(x.drivenTeeth) || x.drivenTeeth < 1)
    simpleError("drivenTeeth", "Provide a positive integer.");
  if (!Number.isInteger(x.driverTeeth) || !Number.isInteger(x.drivenTeeth))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const speedRatio = x.driverTeeth / x.drivenTeeth;
  if (!Number.isFinite(speedRatio))
    simpleError(
      "speedRatio",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { speedRatio: Object.is(speedRatio, -0) ? 0 : speedRatio };
};

export const example = {
  input: { driverTeeth: 20, drivenTeeth: 40 },
  output: { speedRatio: 0.5 },
} satisfies ToolExample<ChainDriveSpeedRatioInput, ChainDriveSpeedRatioOutput>;

export const tool = createSimpleTool({
  id: "engineering/chain-drive-speed-ratio",
  title: "Chain Drive Speed Ratio",
  description:
    "Ideal driven-to-driver chain sprocket speed ratio from integer tooth counts.",
  inputs: [
    { id: "driverTeeth", kind: "integer", label: "Driver Teeth", minimum: 1 },
    { id: "drivenTeeth", kind: "integer", label: "Driven Teeth", minimum: 1 },
  ],
  outputs: [{ id: "speedRatio", kind: "number", label: "Speed Ratio" }],
  calculate: (input) =>
    calculateChainDriveSpeedRatio({
      driverTeeth: input.driverTeeth as number,
      drivenTeeth: input.drivenTeeth as number,
    }),
});
export const chainDriveSpeedRatioTool = tool;
export const runChainDriveSpeedRatio = tool.execute;
export default tool;
