import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const a260A230RatioExample = {
  input: { absorbance230: 1, absorbance260: 2.2 },
} satisfies ToolExample<{
  readonly absorbance230: number;
  readonly absorbance260: number;
}>;

export const a260A230RatioTool = createSimpleTool({
  id: "biology/a260-a230-ratio",
  title: "260/230 Ratio",
  description:
    "Calculate the A260/A230 purity ratio used to detect organic compounds and salts carried over from extraction.",
  inputs: [
    {
      id: "absorbance260",
      label: "Absorbance A260",
      kind: "number",
      minimum: 0,
    },
    { id: "absorbance230", label: "Absorbance A230", kind: "number" },
  ],
  outputs: [{ id: "purityRatio", label: "Purity ratio", kind: "number" }],
  calculate: (input) => {
    const absorbance230 = input.absorbance230 as number;
    if (absorbance230 <= 0)
      simpleError(
        "absorbance230",
        "Absorbance A230 must be greater than zero.",
        "invalid_value",
      );
    return { purityRatio: (input.absorbance260 as number) / absorbance230 };
  },
});
export const runA260A230Ratio = a260A230RatioTool.execute;
export default a260A230RatioTool;
