import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PhosphorusResorptionEfficiencyInput = {
  readonly greenLeafPMgG: number;
  readonly senescedLeafPMgG: number;
};

export type PhosphorusResorptionEfficiencyOutput = {
  readonly phosphorusResorptionEfficiencyPercent: number;
};

export const phosphorusResorptionEfficiencyExample = {
  input: { greenLeafPMgG: 2.5, senescedLeafPMgG: 1 },
  output: { phosphorusResorptionEfficiencyPercent: 60 },
} satisfies ToolExample<
  PhosphorusResorptionEfficiencyInput,
  PhosphorusResorptionEfficiencyOutput
>;

export const phosphorusResorptionEfficiencyTool = createSimpleTool({
  id: "biology/phosphorus-resorption-efficiency",
  title: "P Resorption Efficiency",
  description:
    "Compute phosphorus resorption efficiency in percent as (green leaf P - senesced leaf P) over green leaf P times one hundred.",
  inputs: [
    {
      id: "greenLeafPMgG",
      kind: "number",
      label: "Green leaf P",
      minimum: 0,
      unit: "mg/g",
    },
    {
      id: "senescedLeafPMgG",
      kind: "number",
      label: "Senesced leaf P",
      minimum: 0,
      unit: "mg/g",
    },
  ],
  outputs: [
    {
      id: "phosphorusResorptionEfficiencyPercent",
      kind: "number",
      label: "Phosphorus resorption efficiency",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const greenLeafPMgG = input.greenLeafPMgG as number;
    const senescedLeafPMgG = input.senescedLeafPMgG as number;
    if (!(greenLeafPMgG > 0))
      simpleError(
        "greenLeafPMgG",
        "The green leaf phosphorus concentration must be greater than zero.",
        "invalid_nutrients",
      );
    if (senescedLeafPMgG > greenLeafPMgG)
      simpleError(
        "senescedLeafPMgG",
        "The senesced leaf phosphorus cannot exceed the green leaf phosphorus.",
        "invalid_nutrients",
      );
    return {
      phosphorusResorptionEfficiencyPercent:
        ((greenLeafPMgG - senescedLeafPMgG) / greenLeafPMgG) * 100,
    };
  },
});
export const runPhosphorusResorptionEfficiency =
  phosphorusResorptionEfficiencyTool.execute;
export default phosphorusResorptionEfficiencyTool;
