import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type HemoglobinA1cInput = {
  readonly hba1cPercent: number;
};

export type HemoglobinA1cOutput = {
  readonly category: string;
};

export const hemoglobinA1cExample = {
  input: { hba1cPercent: 6 },
  output: { category: "prediabetes" },
} satisfies ToolExample<HemoglobinA1cInput, HemoglobinA1cOutput>;

export const hemoglobinA1cTool = createSimpleTool({
  id: "biology/hemoglobin-a1c",
  title: "HbA1c Category Lookup",
  description:
    "Classify a hemoglobin A1c percentage as normal below 5.7 percent, prediabetes below 6.5 percent, or diabetes otherwise.",
  inputs: [
    {
      id: "hba1cPercent",
      label: "HbA1c",
      kind: "number",
      maximum: 20,
      minimum: 3,
      unit: "%",
    },
  ],
  outputs: [{ id: "category", label: "Category", kind: "string" }],
  calculate: (input) => {
    const hba1cPercent = input.hba1cPercent as number;
    return {
      category:
        hba1cPercent < 5.7
          ? "normal"
          : hba1cPercent < 6.5
            ? "prediabetes"
            : "diabetes",
    };
  },
});
export const runHemoglobinA1c = hemoglobinA1cTool.execute;
export default hemoglobinA1cTool;
