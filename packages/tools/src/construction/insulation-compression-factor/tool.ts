import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type InsulationCompressionFactorInput = Readonly<{
  readonly originalMillimeters: number;
  readonly compressedMillimeters: number;
}>;
export type InsulationCompressionFactorOutput = Readonly<{
  readonly retainedFraction: number;
}>;

export const calculateInsulationCompressionFactor = (
  x: InsulationCompressionFactorInput,
): InsulationCompressionFactorOutput => {
  if (!Number.isFinite(x.originalMillimeters) || x.originalMillimeters < 0)
    simpleError("originalMillimeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.compressedMillimeters) || x.compressedMillimeters < 0)
    simpleError("compressedMillimeters", "Provide a finite number at least 0.");
  if (x.compressedMillimeters > x.originalMillimeters)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const retainedFraction = x.compressedMillimeters / x.originalMillimeters;
  if (!Number.isFinite(retainedFraction))
    simpleError(
      "retainedFraction",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    retainedFraction: Object.is(retainedFraction, -0) ? 0 : retainedFraction,
  };
};

export const example = {
  input: { originalMillimeters: 100, compressedMillimeters: 80 },
  output: { retainedFraction: 0.8 },
} satisfies ToolExample<
  InsulationCompressionFactorInput,
  InsulationCompressionFactorOutput
>;

export const tool = createSimpleTool({
  id: "construction/insulation-compression-factor",
  title: "Insulation Compression Factor",
  description:
    "Geometric thickness-retention fraction of insulation after compression; it is not a direct R-value correction.",
  inputs: [
    {
      id: "originalMillimeters",
      kind: "number",
      label: "Original Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "compressedMillimeters",
      kind: "number",
      label: "Compressed Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "retainedFraction", kind: "number", label: "Retained Fraction" },
  ],
  calculate: (input) =>
    calculateInsulationCompressionFactor({
      originalMillimeters: input.originalMillimeters as number,
      compressedMillimeters: input.compressedMillimeters as number,
    }),
});
export const insulationCompressionFactorTool = tool;
export const runInsulationCompressionFactor = tool.execute;
export default tool;
