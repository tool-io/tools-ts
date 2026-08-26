import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const hemoglobinConcentrationExample = {
  input: { hematocritPercent: 45 },
  output: { hemoglobinGDl: 15 },
} satisfies ToolExample<
  { readonly hematocritPercent: number },
  { readonly hemoglobinGDl: number }
>;

export const hemoglobinConcentrationTool = createSimpleTool({
  id: "biology/hemoglobin-concentration",
  title: "Hemoglobin From Hct Proxy",
  description:
    "Approximate hemoglobin in g/dL from hematocrit percent with the clinical rule of three: hemoglobin is about one third of hematocrit. This screening proxy can be unreliable when red-cell size or hemoglobinization is abnormal.",
  inputs: [
    {
      id: "hematocritPercent",
      label: "Hematocrit",
      kind: "number",
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "hemoglobinGDl",
      label: "Hemoglobin",
      kind: "number",
      unit: "g/dL",
    },
  ],
  calculate: (input) => {
    const hematocritPercent = input.hematocritPercent as number;
    if (hematocritPercent <= 0)
      simpleError("hematocritPercent", "Hematocrit must be greater than zero.");
    return { hemoglobinGDl: hematocritPercent / 3 };
  },
});
export const runHemoglobinConcentration = hemoglobinConcentrationTool.execute;
export default hemoglobinConcentrationTool;
