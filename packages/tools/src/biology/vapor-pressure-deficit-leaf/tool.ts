import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type VaporPressureDeficitLeafInput = {
  readonly leafTempC: number;
  readonly relativeHumidityPercent: number;
};

export type VaporPressureDeficitLeafOutput = {
  readonly leafVpdKpa: number;
};

export const vaporPressureDeficitLeafExample = {
  input: { leafTempC: 25, relativeHumidityPercent: 60 },
  output: { leafVpdKpa: 1.2671110870027391 },
} satisfies ToolExample<
  VaporPressureDeficitLeafInput,
  VaporPressureDeficitLeafOutput
>;

export const vaporPressureDeficitLeafTool = createSimpleTool({
  id: "biology/vapor-pressure-deficit-leaf",
  title: "Leaf VPD From RH",
  description:
    "Compute the leaf vapour pressure deficit in kilopascals from leaf temperature using the Tetens equation for saturation vapour pressure, 0.6108 times e^(17.27 times temperature divided by temperature plus 237.3), scaled by one minus relative humidity over one hundred.",
  inputs: [
    {
      description: "Leaf temperature in degrees Celsius between -10 and 60.",
      id: "leafTempC",
      kind: "number",
      label: "Leaf temperature",
      maximum: 60,
      minimum: -10,
      unit: "\u00b0C",
    },
    {
      description:
        "Relative humidity as a percentage between 0 and 100; zero yields the full saturation vapour pressure.",
      id: "relativeHumidityPercent",
      kind: "number",
      label: "Relative humidity",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      description:
        "Leaf vapour pressure deficit in kilopascals; positive or zero.",
      id: "leafVpdKpa",
      kind: "number",
      label: "Leaf VPD",
      unit: "kPa",
    },
  ],
  calculate: (input) => {
    const leafTempC = input.leafTempC as number;
    const relativeHumidityPercent = input.relativeHumidityPercent as number;
    const svpKpa = 0.6108 * Math.exp((17.27 * leafTempC) / (leafTempC + 237.3));
    return {
      leafVpdKpa: svpKpa * (1 - relativeHumidityPercent / 100),
    };
  },
});
export const runVaporPressureDeficitLeaf = vaporPressureDeficitLeafTool.execute;
export default vaporPressureDeficitLeafTool;
