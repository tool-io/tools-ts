import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NitrogenResorptionEfficiencyInput = {
  readonly greenLeafNMgG: number;
  readonly senescedLeafNMgG: number;
};

export type NitrogenResorptionEfficiencyOutput = {
  readonly nitrogenResorptionEfficiencyPercent: number;
};

export const nitrogenResorptionEfficiencyExample = {
  input: { greenLeafNMgG: 20, senescedLeafNMgG: 8 },
  output: { nitrogenResorptionEfficiencyPercent: 60 },
} satisfies ToolExample<
  NitrogenResorptionEfficiencyInput,
  NitrogenResorptionEfficiencyOutput
>;

export const nitrogenResorptionEfficiencyTool = createSimpleTool({
  id: "biology/nitrogen-resorption-efficiency",
  title: "N Resorption Efficiency",
  description:
    "Compute nitrogen resorption efficiency in percent as (green leaf N - senesced leaf N) over green leaf N times one hundred.",
  inputs: [
    {
      id: "greenLeafNMgG",
      kind: "number",
      label: "Green leaf N",
      minimum: 0,
      unit: "mg/g",
    },
    {
      id: "senescedLeafNMgG",
      kind: "number",
      label: "Senesced leaf N",
      minimum: 0,
      unit: "mg/g",
    },
  ],
  outputs: [
    {
      id: "nitrogenResorptionEfficiencyPercent",
      kind: "number",
      label: "Nitrogen resorption efficiency",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const greenLeafNMgG = input.greenLeafNMgG as number;
    const senescedLeafNMgG = input.senescedLeafNMgG as number;
    if (!(greenLeafNMgG > 0))
      simpleError(
        "greenLeafNMgG",
        "The green leaf nitrogen concentration must be greater than zero.",
        "invalid_nutrients",
      );
    if (senescedLeafNMgG > greenLeafNMgG)
      simpleError(
        "senescedLeafNMgG",
        "The senesced leaf nitrogen cannot exceed the green leaf nitrogen.",
        "invalid_nutrients",
      );
    return {
      nitrogenResorptionEfficiencyPercent:
        ((greenLeafNMgG - senescedLeafNMgG) / greenLeafNMgG) * 100,
    };
  },
});
export const runNitrogenResorptionEfficiency =
  nitrogenResorptionEfficiencyTool.execute;
export default nitrogenResorptionEfficiencyTool;
