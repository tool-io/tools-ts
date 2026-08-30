import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GlueCoverageAreaInput = Readonly<{
  readonly glueMassKg: number;
  readonly applicationRateKgPerM2: number;
}>;
export type GlueCoverageAreaOutput = Readonly<{
  readonly coverageAreaM2: number;
}>;

export const calculateGlueCoverageArea = (
  x: GlueCoverageAreaInput,
): GlueCoverageAreaOutput => {
  if (!Number.isFinite(x.glueMassKg) || x.glueMassKg < 0)
    simpleError("glueMassKg", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.applicationRateKgPerM2) ||
    x.applicationRateKgPerM2 < 0
  )
    simpleError(
      "applicationRateKgPerM2",
      "Provide a finite number at least 0.",
    );
  if (!(x.applicationRateKgPerM2 > 0))
    simpleError("applicationRateKgPerM2", "Application rate must be positive.");
  const coverageAreaM2 = x.glueMassKg / x.applicationRateKgPerM2;
  if (!Number.isFinite(coverageAreaM2))
    simpleError("coverageAreaM2", "The inputs produce an invalid result.");
  return { coverageAreaM2: Object.is(coverageAreaM2, -0) ? 0 : coverageAreaM2 };
};

export const example = {
  input: { glueMassKg: 1, applicationRateKgPerM2: 0.2 },
  output: { coverageAreaM2: 5 },
} satisfies ToolExample<GlueCoverageAreaInput, GlueCoverageAreaOutput>;

export const tool = createSimpleTool({
  id: "carpentry/glue-coverage-area",
  title: "Glue Coverage Area",
  description:
    "Estimate glue-coated area from usable glue mass and product application rate in mass per unit area.",
  inputs: [
    {
      id: "glueMassKg",
      kind: "number",
      label: "Usable glue mass",
      unit: "kg",
      minimum: 0,
    },
    {
      id: "applicationRateKgPerM2",
      kind: "number",
      label: "Application rate",
      unit: "kg/m²",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "coverageAreaM2",
      kind: "number",
      label: "One-coat glue coverage",
      unit: "m²",
    },
  ],
  calculate: (input) =>
    calculateGlueCoverageArea({
      glueMassKg: input.glueMassKg as number,
      applicationRateKgPerM2: input.applicationRateKgPerM2 as number,
    }),
});
export const glueCoverageAreaTool = tool;
export const runGlueCoverageArea = tool.execute;
export default tool;
