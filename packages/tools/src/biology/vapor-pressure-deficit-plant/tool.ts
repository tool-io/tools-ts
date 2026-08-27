import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VaporPressureDeficitPlantInput = {
  readonly saturationVaporPressureKpa: number;
  readonly actualVaporPressureKpa: number;
};

export type VaporPressureDeficitPlantOutput = {
  readonly vaporPressureDeficitKpa: number;
};

export const vaporPressureDeficitPlantExample = {
  input: { saturationVaporPressureKpa: 2.5, actualVaporPressureKpa: 1.6 },
  output: { vaporPressureDeficitKpa: 0.8999999999999999 },
} satisfies ToolExample<
  VaporPressureDeficitPlantInput,
  VaporPressureDeficitPlantOutput
>;

export const vaporPressureDeficitPlantTool = createSimpleTool({
  id: "biology/vapor-pressure-deficit-plant",
  title: "VPD Calculator",
  description:
    "Compute the leaf level vapour pressure deficit in kilopascals as saturation vapour pressure minus actual vapour pressure.",
  inputs: [
    {
      id: "saturationVaporPressureKpa",
      kind: "number",
      label: "Saturation vapour pressure",
      unit: "kPa",
    },
    {
      id: "actualVaporPressureKpa",
      kind: "number",
      label: "Actual vapour pressure",
      unit: "kPa",
    },
  ],
  outputs: [
    {
      id: "vaporPressureDeficitKpa",
      kind: "number",
      label: "Vapour pressure deficit",
      unit: "kPa",
    },
  ],
  calculate: (input) => {
    const saturationVaporPressureKpa =
      input.saturationVaporPressureKpa as number;
    const actualVaporPressureKpa = input.actualVaporPressureKpa as number;
    if (saturationVaporPressureKpa < actualVaporPressureKpa)
      simpleError(
        "saturationVaporPressureKpa",
        "The actual vapour pressure must not exceed the saturation vapour pressure.",
        "invalid_pressures",
      );
    return {
      vaporPressureDeficitKpa:
        saturationVaporPressureKpa - actualVaporPressureKpa,
    };
  },
});
export const runVaporPressureDeficitPlant =
  vaporPressureDeficitPlantTool.execute;
export default vaporPressureDeficitPlantTool;
