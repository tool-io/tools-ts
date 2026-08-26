import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HematocritFromHemoglobinInput = {
  readonly hemoglobinGDl: number;
};

export type HematocritFromHemoglobinOutput = {
  readonly hematocritPercent: number;
};

export const hematocritFromHemoglobinExample = {
  input: { hemoglobinGDl: 15 },
  output: { hematocritPercent: 45 },
} satisfies ToolExample<
  HematocritFromHemoglobinInput,
  HematocritFromHemoglobinOutput
>;

export const hematocritFromHemoglobinTool = createSimpleTool({
  id: "biology/hematocrit-from-hemoglobin",
  title: "Rule Of Three Hct",
  description:
    "Approximate hematocrit from hemoglobin with the rule of three: each g/dL of hemoglobin contributes about three percent hematocrit.",
  inputs: [
    {
      id: "hemoglobinGDl",
      label: "Hemoglobin",
      kind: "number",
      unit: "g/dL",
    },
  ],
  outputs: [
    {
      id: "hematocritPercent",
      label: "Hematocrit",
      kind: "number",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const hemoglobinGDl = input.hemoglobinGDl as number;
    if (hemoglobinGDl <= 0)
      simpleError("hemoglobinGDl", "The hemoglobin must be greater than zero.");
    return { hematocritPercent: hemoglobinGDl * 3 };
  },
});
export const runHematocritFromHemoglobin = hematocritFromHemoglobinTool.execute;
export default hematocritFromHemoglobinTool;
