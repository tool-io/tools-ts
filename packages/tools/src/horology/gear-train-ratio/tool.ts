import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GearTrainRatioInput = Readonly<{
  readonly drivingTeeth: number;
  readonly drivenTeeth: number;
}>;
export type GearTrainRatioOutput = Readonly<{
  readonly speedRatio: number;
}>;

export const calculateGearTrainRatio = (
  x: GearTrainRatioInput,
): GearTrainRatioOutput => {
  if (
    !Number.isFinite(x.drivingTeeth) ||
    !Number.isSafeInteger(x.drivingTeeth) ||
    x.drivingTeeth < 1
  )
    simpleError("drivingTeeth", "Provide a positive safe integer.");
  if (
    !Number.isFinite(x.drivenTeeth) ||
    !Number.isSafeInteger(x.drivenTeeth) ||
    x.drivenTeeth < 1
  )
    simpleError("drivenTeeth", "Provide a positive safe integer.");
  const speedRatio = x.drivingTeeth / x.drivenTeeth;
  if (!Number.isFinite(speedRatio))
    simpleError(
      "speedRatio",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { speedRatio: Object.is(speedRatio, -0) ? 0 : speedRatio };
};

export const example = {
  input: {
    drivingTeeth: 20,
    drivenTeeth: 40,
  },
  output: { speedRatio: 0.5 },
} satisfies ToolExample<GearTrainRatioInput, GearTrainRatioOutput>;

export const tool = createSimpleTool({
  id: "horology/gear-train-ratio",
  title: "Gear Train Ratio",
  description:
    "Driven rotational speed divided by driving rotational speed for one meshing gear pair.",
  inputs: [
    { id: "drivingTeeth", kind: "integer", label: "Driving Teeth", minimum: 1 },
    { id: "drivenTeeth", kind: "integer", label: "Driven Teeth", minimum: 1 },
  ],
  outputs: [{ id: "speedRatio", kind: "number", label: "Speed Ratio" }],
  calculate: (input) =>
    calculateGearTrainRatio({
      drivingTeeth: input.drivingTeeth as number,
      drivenTeeth: input.drivenTeeth as number,
    }),
});
export const gearTrainRatioTool = tool;
export const runGearTrainRatio = tool.execute;
export default tool;
