import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type MassSpecIsotopicPatternInput = {
  readonly carbonCount: number;
};

export type MassSpecIsotopicPatternOutput = {
  readonly isotopeRatioM1M: number;
};

export const massSpecIsotopicPatternExample = {
  input: { carbonCount: 6 },
  output: { isotopeRatioM1M: 0.066 },
} satisfies ToolExample<
  MassSpecIsotopicPatternInput,
  MassSpecIsotopicPatternOutput
>;

export const massSpecIsotopicPatternTool = createSimpleTool({
  id: "chemistry/mass-spec-isotopic-pattern",
  title: "Isotope Pattern Ratio",
  description:
    "Estimate the M+1 to M peak intensity ratio from carbon count times 0.011 for natural 13C abundance of 1.1 percent.",
  inputs: [
    {
      id: "carbonCount",
      label: "Carbon atoms",
      kind: "integer",
      maximum: 200,
      minimum: 0,
    },
  ],
  outputs: [
    { id: "isotopeRatioM1M", label: "M+1 over M ratio", kind: "number" },
  ],
  calculate: (input) => ({
    isotopeRatioM1M: (input.carbonCount as number) * 0.011,
  }),
});
export const runMassSpecIsotopicPattern = massSpecIsotopicPatternTool.execute;
export default massSpecIsotopicPatternTool;
