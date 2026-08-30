import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GearRatioInput = Readonly<{
  readonly driverTeeth: number;
  readonly drivenTeeth: number;
}>;
export type GearRatioOutput = Readonly<{
  readonly reductionRatio: number;
}>;

export const calculateGearRatio = (x: GearRatioInput): GearRatioOutput => {
  if (!Number.isFinite(x.driverTeeth) || x.driverTeeth < 1)
    simpleError("driverTeeth", "Provide a positive integer.");
  if (!Number.isFinite(x.drivenTeeth) || x.drivenTeeth < 1)
    simpleError("drivenTeeth", "Provide a positive integer.");
  if (
    !Number.isSafeInteger(x.driverTeeth) ||
    !Number.isSafeInteger(x.drivenTeeth)
  )
    simpleError("input", "Inputs violate the stated model or operating range.");
  const reductionRatio = x.drivenTeeth / x.driverTeeth;
  if (!Number.isFinite(reductionRatio))
    simpleError(
      "reductionRatio",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { reductionRatio: Object.is(reductionRatio, -0) ? 0 : reductionRatio };
};

export const example = {
  input: { driverTeeth: 20, drivenTeeth: 40 },
  output: { reductionRatio: 2 },
} satisfies ToolExample<GearRatioInput, GearRatioOutput>;

export const tool = createSimpleTool({
  id: "engineering/gear-ratio",
  title: "Gear Ratio",
  description:
    "Ideal simple external-gear speed reduction ratio from driven and driver tooth counts; excludes idlers and losses.",
  inputs: [
    { id: "driverTeeth", kind: "integer", label: "Driver Teeth", minimum: 1 },
    { id: "drivenTeeth", kind: "integer", label: "Driven Teeth", minimum: 1 },
  ],
  outputs: [{ id: "reductionRatio", kind: "number", label: "Reduction Ratio" }],
  calculate: (input) =>
    calculateGearRatio({
      driverTeeth: input.driverTeeth as number,
      drivenTeeth: input.drivenTeeth as number,
    }),
});
export const gearRatioTool = tool;
export const runGearRatio = tool.execute;
export default tool;
