import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const a260A280RatioExample = {
  input: { absorbance260: 1.8, absorbance280: 1 },
} satisfies ToolExample<{
  readonly absorbance260: number;
  readonly absorbance280: number;
}>;

export const a260A280RatioTool = createSimpleTool({
  id: "biology/a260-a280-ratio",
  title: "260/280 Ratio",
  description:
    "Calculate the A260/A280 purity ratio used to assess nucleic acid contamination by protein.",
  inputs: [
    {
      id: "absorbance260",
      label: "Absorbance A260",
      kind: "number",
      minimum: 0,
    },
    { id: "absorbance280", label: "Absorbance A280", kind: "number" },
  ],
  outputs: [{ id: "purityRatio", label: "Purity ratio", kind: "number" }],
  calculate: (input) => {
    const absorbance280 = input.absorbance280 as number;
    if (absorbance280 <= 0)
      simpleError(
        "absorbance280",
        "Absorbance A280 must be greater than zero.",
        "invalid_value",
      );
    return { purityRatio: (input.absorbance260 as number) / absorbance280 };
  },
});
export const runA260A280Ratio = a260A280RatioTool.execute;
export default a260A280RatioTool;
