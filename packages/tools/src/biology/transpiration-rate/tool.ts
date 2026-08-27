import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TranspirationRateInput = {
  readonly waterLossMmolPerSecond: number;
  readonly leafAreaM2: number;
};

export type TranspirationRateOutput = {
  readonly transpirationRate: number;
};

export const transpirationRateExample = {
  input: { waterLossMmolPerSecond: 2, leafAreaM2: 0.05 },
  output: { transpirationRate: 40 },
} satisfies ToolExample<TranspirationRateInput, TranspirationRateOutput>;

export const transpirationRateTool = createSimpleTool({
  id: "biology/transpiration-rate",
  title: "Transpiration Rate",
  description:
    "Compute the transpiration rate in millimoles of water per square metre per second from water loss and leaf area.",
  inputs: [
    {
      id: "waterLossMmolPerSecond",
      kind: "number",
      label: "Water loss",
      minimum: 0,
      unit: "mmol/s",
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
      id: "transpirationRate",
      kind: "number",
      label: "Transpiration rate",
      unit: "mmol/m²/s",
    },
  ],
  calculate: (input) => {
    const leafAreaM2 = input.leafAreaM2 as number;
    if (!(leafAreaM2 > 0))
      simpleError("leafAreaM2", "The leaf area must be greater than zero.");
    return {
      transpirationRate: (input.waterLossMmolPerSecond as number) / leafAreaM2,
    };
  },
});
export const runTranspirationRate = transpirationRateTool.execute;
export default transpirationRateTool;
