import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BendDeductionInput = Readonly<{
  readonly bendAngleDegrees: number;
  readonly insideRadiusMillimeters: number;
  readonly thicknessMillimeters: number;
  readonly bendAllowanceMillimeters: number;
}>;
export type BendDeductionOutput = Readonly<{
  readonly bendDeductionMillimeters: number;
}>;

export const calculateBendDeduction = (
  x: BendDeductionInput,
): BendDeductionOutput => {
  if (!Number.isFinite(x.bendAngleDegrees) || x.bendAngleDegrees < 0)
    simpleError("bendAngleDegrees", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.insideRadiusMillimeters) ||
    x.insideRadiusMillimeters < 0
  )
    simpleError(
      "insideRadiusMillimeters",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.thicknessMillimeters) || x.thicknessMillimeters < 0)
    simpleError("thicknessMillimeters", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.bendAllowanceMillimeters) ||
    x.bendAllowanceMillimeters < 0
  )
    simpleError(
      "bendAllowanceMillimeters",
      "Provide a finite number at least 0.",
    );
  if (x.bendAngleDegrees >= 180)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const bendDeductionMillimeters =
    2 *
      (x.insideRadiusMillimeters + x.thicknessMillimeters) *
      Math.tan((x.bendAngleDegrees * Math.PI) / 360) -
    x.bendAllowanceMillimeters;
  if (!Number.isFinite(bendDeductionMillimeters))
    simpleError(
      "bendDeductionMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    bendDeductionMillimeters: Object.is(bendDeductionMillimeters, -0)
      ? 0
      : bendDeductionMillimeters,
  };
};

export const example = {
  input: {
    bendAngleDegrees: 90,
    insideRadiusMillimeters: 2,
    thicknessMillimeters: 1,
    bendAllowanceMillimeters: 3.77,
  },
  output: { bendDeductionMillimeters: 2.229999999999999 },
} satisfies ToolExample<BendDeductionInput, BendDeductionOutput>;

export const tool = createSimpleTool({
  id: "engineering/bend-deduction",
  title: "Bend Deduction",
  description:
    "Sheet-metal bend deduction 2(R+t)tan(θ/2)−BA using an already calculated bend allowance.",
  inputs: [
    {
      id: "bendAngleDegrees",
      kind: "number",
      label: "Bend Angle Degrees",
      unit: "°",
      minimum: 0,
    },
    {
      id: "insideRadiusMillimeters",
      kind: "number",
      label: "Inside Radius Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "thicknessMillimeters",
      kind: "number",
      label: "Thickness Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "bendAllowanceMillimeters",
      kind: "number",
      label: "Bend Allowance Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "bendDeductionMillimeters",
      kind: "number",
      label: "Bend Deduction Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateBendDeduction({
      bendAngleDegrees: input.bendAngleDegrees as number,
      insideRadiusMillimeters: input.insideRadiusMillimeters as number,
      thicknessMillimeters: input.thicknessMillimeters as number,
      bendAllowanceMillimeters: input.bendAllowanceMillimeters as number,
    }),
});
export const bendDeductionTool = tool;
export const runBendDeduction = tool.execute;
export default tool;
