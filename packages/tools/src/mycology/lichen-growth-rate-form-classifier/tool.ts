import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const lichenGrowthRateFormClassifierExample = {
  input: { form: "foliose" },
  output: { growthForm: "foliose" },
} satisfies ToolExample<
  {
    readonly form: string;
  },
  {
    readonly growthForm: string;
  }
>;

export const lichenGrowthRateFormClassifierTool = createSimpleTool({
  id: "mycology/lichen-growth-rate-form-classifier",
  title: "Lichen Growth Form",
  description:
    "Classify a lichen as crustose, foliose, or fruticose without assigning a universal growth rate; rates vary substantially among species and environments.",
  inputs: [
    {
      enum: ["crustose", "foliose", "fruticose"],
      id: "form",
      label: "Growth form",
      kind: "string",
    },
  ],
  outputs: [{ id: "growthForm", label: "Growth form", kind: "string" }],
  calculate: (input) => {
    const growthForm = input.form as string;
    return { growthForm };
  },
});
export const runLichenGrowthRateFormClassifier =
  lichenGrowthRateFormClassifierTool.execute;
export default lichenGrowthRateFormClassifierTool;
