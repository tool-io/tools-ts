import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NetPhotosynthesisRateInput = {
  readonly co2UptakeUmolPerSecond: number;
  readonly leafAreaM2: number;
};

export type NetPhotosynthesisRateOutput = {
  readonly netPhotosynthesisRate: number;
};

export const netPhotosynthesisRateExample = {
  input: { co2UptakeUmolPerSecond: 10, leafAreaM2: 0.05 },
  output: { netPhotosynthesisRate: 200 },
} satisfies ToolExample<
  NetPhotosynthesisRateInput,
  NetPhotosynthesisRateOutput
>;

export const netPhotosynthesisRateTool = createSimpleTool({
  id: "biology/net-photosynthesis-rate",
  title: "Net Photosynthesis Rate",
  description:
    "Compute the net photosynthesis rate in micromoles of carbon dioxide per square metre per second from uptake and leaf area.",
  inputs: [
    {
      id: "co2UptakeUmolPerSecond",
      kind: "number",
      label: "CO2 uptake",
      minimum: 0,
      unit: "µmol/s",
    },
    {
      id: "leafAreaM2",
      kind: "number",
      label: "Leaf area",
      unit: "m²",
    },
  ],
  outputs: [
    {
      id: "netPhotosynthesisRate",
      kind: "number",
      label: "Net photosynthesis rate",
      unit: "µmol/m²/s",
    },
  ],
  calculate: (input) => {
    const leafAreaM2 = input.leafAreaM2 as number;
    if (!(leafAreaM2 > 0))
      simpleError("leafAreaM2", "The leaf area must be greater than zero.");
    return {
      netPhotosynthesisRate:
        (input.co2UptakeUmolPerSecond as number) / leafAreaM2,
    };
  },
});
export const runNetPhotosynthesisRate = netPhotosynthesisRateTool.execute;
export default netPhotosynthesisRateTool;
