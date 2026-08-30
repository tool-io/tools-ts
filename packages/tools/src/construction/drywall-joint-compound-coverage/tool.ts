import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DrywallJointCompoundCoverageInput = Readonly<{
  readonly compoundLiters: number;
  readonly squareMetersPerLiter: number;
}>;
export type DrywallJointCompoundCoverageOutput = Readonly<{
  readonly coverageSquareMeters: number;
}>;

export const calculateDrywallJointCompoundCoverage = (
  x: DrywallJointCompoundCoverageInput,
): DrywallJointCompoundCoverageOutput => {
  if (!Number.isFinite(x.compoundLiters) || x.compoundLiters < 0)
    simpleError("compoundLiters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.squareMetersPerLiter) || x.squareMetersPerLiter < 0)
    simpleError("squareMetersPerLiter", "Provide a finite number at least 0.");
  const coverageSquareMeters = x.compoundLiters * x.squareMetersPerLiter;
  if (!Number.isFinite(coverageSquareMeters))
    simpleError(
      "coverageSquareMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    coverageSquareMeters: Object.is(coverageSquareMeters, -0)
      ? 0
      : coverageSquareMeters,
  };
};

export const example = {
  input: { compoundLiters: 10, squareMetersPerLiter: 2 },
  output: { coverageSquareMeters: 20 },
} satisfies ToolExample<
  DrywallJointCompoundCoverageInput,
  DrywallJointCompoundCoverageOutput
>;

export const tool = createSimpleTool({
  id: "construction/drywall-joint-compound-coverage",
  title: "Drywall Joint Compound Coverage",
  description:
    "Coverage area from joint-compound quantity and an observed or product-stated area-per-liter rate.",
  inputs: [
    {
      id: "compoundLiters",
      kind: "number",
      label: "Compound Liters",
      unit: "L",
      minimum: 0,
    },
    {
      id: "squareMetersPerLiter",
      kind: "number",
      label: "Square Meters Per Liter",
      unit: "m²/L",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "coverageSquareMeters",
      kind: "number",
      label: "Coverage Square Meters",
      unit: "m²",
    },
  ],
  calculate: (input) =>
    calculateDrywallJointCompoundCoverage({
      compoundLiters: input.compoundLiters as number,
      squareMetersPerLiter: input.squareMetersPerLiter as number,
    }),
});
export const drywallJointCompoundCoverageTool = tool;
export const runDrywallJointCompoundCoverage = tool.execute;
export default tool;
