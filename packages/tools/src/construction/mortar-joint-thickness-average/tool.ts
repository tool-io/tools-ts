import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MortarJointThicknessAverageInput = Readonly<{
  readonly summedMillimeters: number;
  readonly jointCount: number;
}>;
export type MortarJointThicknessAverageOutput = Readonly<{
  readonly averageMillimeters: number;
}>;

export const calculateMortarJointThicknessAverage = (
  x: MortarJointThicknessAverageInput,
): MortarJointThicknessAverageOutput => {
  if (!Number.isFinite(x.summedMillimeters) || x.summedMillimeters < 0)
    simpleError("summedMillimeters", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.jointCount) ||
    !Number.isSafeInteger(x.jointCount) ||
    x.jointCount < 0
  )
    simpleError("jointCount", "Provide a safe integer at least 0.");
  if (!Number.isSafeInteger(x.jointCount))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const averageMillimeters = x.summedMillimeters / x.jointCount;
  if (!Number.isFinite(averageMillimeters))
    simpleError(
      "averageMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    averageMillimeters: Object.is(averageMillimeters, -0)
      ? 0
      : averageMillimeters,
  };
};

export const example = {
  input: { summedMillimeters: 100, jointCount: 10 },
  output: { averageMillimeters: 10 },
} satisfies ToolExample<
  MortarJointThicknessAverageInput,
  MortarJointThicknessAverageOutput
>;

export const tool = createSimpleTool({
  id: "construction/mortar-joint-thickness-average",
  title: "Mortar Joint Thickness Average",
  description:
    "Mean mortar-joint thickness from summed measured joint thicknesses and the number of joints.",
  inputs: [
    {
      id: "summedMillimeters",
      kind: "number",
      label: "Summed Millimeters",
      unit: "mm",
      minimum: 0,
    },
    { id: "jointCount", kind: "integer", label: "Joint Count", minimum: 0 },
  ],
  outputs: [
    {
      id: "averageMillimeters",
      kind: "number",
      label: "Average Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateMortarJointThicknessAverage({
      summedMillimeters: input.summedMillimeters as number,
      jointCount: input.jointCount as number,
    }),
});
export const mortarJointThicknessAverageTool = tool;
export const runMortarJointThicknessAverage = tool.execute;
export default tool;
