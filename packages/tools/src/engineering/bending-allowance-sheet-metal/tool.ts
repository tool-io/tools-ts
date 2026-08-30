import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BendingAllowanceSheetMetalInput = Readonly<{
  readonly bendAngleDegrees: number;
  readonly insideRadiusMillimeters: number;
  readonly thicknessMillimeters: number;
  readonly kFactor: number;
}>;
export type BendingAllowanceSheetMetalOutput = Readonly<{
  readonly bendAllowanceMillimeters: number;
}>;

export const calculateBendingAllowanceSheetMetal = (
  x: BendingAllowanceSheetMetalInput,
): BendingAllowanceSheetMetalOutput => {
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
  if (!Number.isFinite(x.kFactor) || x.kFactor < 0)
    simpleError("kFactor", "Provide a finite number at least 0.");
  if (x.bendAngleDegrees >= 180 || x.kFactor > 1)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const bendAllowanceMillimeters =
    ((x.bendAngleDegrees * Math.PI) / 180) *
    (x.insideRadiusMillimeters + x.kFactor * x.thicknessMillimeters);
  if (!Number.isFinite(bendAllowanceMillimeters))
    simpleError(
      "bendAllowanceMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    bendAllowanceMillimeters: Object.is(bendAllowanceMillimeters, -0)
      ? 0
      : bendAllowanceMillimeters,
  };
};

export const example = {
  input: {
    bendAngleDegrees: 90,
    insideRadiusMillimeters: 2,
    thicknessMillimeters: 1,
    kFactor: 0.4,
  },
  output: { bendAllowanceMillimeters: 3.7699111843077517 },
} satisfies ToolExample<
  BendingAllowanceSheetMetalInput,
  BendingAllowanceSheetMetalOutput
>;

export const tool = createSimpleTool({
  id: "engineering/bending-allowance-sheet-metal",
  title: "Bending Allowance Sheet Metal",
  description:
    "Sheet-metal bend allowance from bend angle, inside radius, thickness and specified K-factor: BA=θ(R+Kt).",
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
    { id: "kFactor", kind: "number", label: "K Factor", minimum: 0 },
  ],
  outputs: [
    {
      id: "bendAllowanceMillimeters",
      kind: "number",
      label: "Bend Allowance Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateBendingAllowanceSheetMetal({
      bendAngleDegrees: input.bendAngleDegrees as number,
      insideRadiusMillimeters: input.insideRadiusMillimeters as number,
      thicknessMillimeters: input.thicknessMillimeters as number,
      kFactor: input.kFactor as number,
    }),
});
export const bendingAllowanceSheetMetalTool = tool;
export const runBendingAllowanceSheetMetal = tool.execute;
export default tool;
