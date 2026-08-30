import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DrywallMudCoverageInput = Readonly<{
  readonly treatedAreaSquareMeters: number;
  readonly coverageKgPerSquareMeterPerCoat: number;
  readonly coatCount: number;
}>;
export type DrywallMudCoverageOutput = Readonly<{ compoundMassKg: number }>;

export const calculateDrywallMudCoverage = (
  i: DrywallMudCoverageInput,
): DrywallMudCoverageOutput => {
  const value =
    i.treatedAreaSquareMeters * i.coverageKgPerSquareMeterPerCoat * i.coatCount;
  if (!Number.isFinite(value))
    simpleError("compoundMassKg", "The inputs produce a non-finite result.");
  return { compoundMassKg: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: {
    treatedAreaSquareMeters: 100,
    coverageKgPerSquareMeterPerCoat: 0.2,
    coatCount: 3,
  },
  output: { compoundMassKg: 60 },
} satisfies ToolExample<DrywallMudCoverageInput, DrywallMudCoverageOutput>;

export const tool = createSimpleTool({
  id: "construction/drywall-mud-coverage",
  title: "Drywall Mud Coverage",
  description:
    "Estimate drywall joint-compound mass from treated area, a project or product coverage rate in kilograms per square meter per coat, and coat count.",
  inputs: [
    {
      id: "treatedAreaSquareMeters",
      kind: "number",
      label: "Treated Area (m²)",
      unit: "m²",
      minimum: 0,
    },
    {
      id: "coverageKgPerSquareMeterPerCoat",
      kind: "number",
      label: "Coverage (kg/m²/coat)",
      unit: "kg/m²/coat",
      minimum: 0,
    },
    { id: "coatCount", kind: "integer", label: "Coat Count", minimum: 0 },
  ],
  outputs: [
    {
      id: "compoundMassKg",
      kind: "number",
      label: "Compound Mass (kg)",
      unit: "kg",
    },
  ],
  calculate: (input) =>
    calculateDrywallMudCoverage({
      treatedAreaSquareMeters: input.treatedAreaSquareMeters as number,
      coverageKgPerSquareMeterPerCoat:
        input.coverageKgPerSquareMeterPerCoat as number,
      coatCount: input.coatCount as number,
    }),
});
export const drywallMudCoverageTool = tool;
export const runDrywallMudCoverage = tool.execute;
export default tool;
