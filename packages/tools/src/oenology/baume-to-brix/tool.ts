import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type BaumeToBrixInput = {
  readonly baume: number;
};

export type BaumeToBrixOutput = {
  readonly brix: number;
};

export const baumeToBrixExample = {
  input: {
    baume: 11.1,
  },
  output: {
    brix: 19.98,
  },
} satisfies ToolExample<BaumeToBrixInput, BaumeToBrixOutput>;

export const calculateBaumeToBrix = (
  input: BaumeToBrixInput,
): BaumeToBrixOutput => {
  return { brix: roundStatistic(input.baume * 1.8) };
};

export const baumeToBrixTool = createSimpleTool({
  calculate: (input) =>
    calculateBaumeToBrix(input as unknown as BaumeToBrixInput),
  description:
    "Estimate degrees Brix from degrees Baumé with the simple Brix ≈ 1.8 × Baumé winemaking approximation; exact relationships depend on the Baumé scale and measurement conditions.",
  id: "oenology/baume-to-brix",
  inputs: [
    {
      description: "Must density in degrees Baumé.",
      id: "baume",
      label: "Baumé",
      kind: "number",
      minimum: 0,
      unit: "°Bé",
    },
  ],
  outputs: [
    {
      description: "Approximate dissolved sugar in degrees Brix.",
      id: "brix",
      kind: "number",
      label: "Brix",
      unit: "°Bx",
    },
  ],
  title: "Baumé to Brix Converter",
});
export const runBaumeToBrix = baumeToBrixTool.execute;
export default baumeToBrixTool;
