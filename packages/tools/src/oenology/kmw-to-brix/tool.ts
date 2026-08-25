import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type KmwToBrixInput = {
  readonly kmw: number;
};

export type KmwToBrixOutput = {
  readonly brix: number;
};

export const kmwToBrixExample = {
  input: {
    kmw: 21,
  },
  output: {
    brix: 24.7058823529,
  },
} satisfies ToolExample<KmwToBrixInput, KmwToBrixOutput>;

export const calculateKmwToBrix = (input: KmwToBrixInput): KmwToBrixOutput => {
  if (input.kmw < 0)
    simpleError("kmw", "KMW cannot be negative.", "invalid_value");
  return { brix: roundStatistic(input.kmw * (20 / 17)) };
};

export const kmwToBrixTool = createSimpleTool({
  calculate: (input) => calculateKmwToBrix(input as unknown as KmwToBrixInput),
  description:
    "Convert Austrian Klosterneuburger Mostwaage to sucrose mass percent using the statutory definition 1 °KMW = 20/17 mass-percent sucrose, reported as approximate °Bx.",
  id: "oenology/kmw-to-brix",
  inputs: [
    {
      description: "Must weight in KMW (Babo) degrees.",
      id: "kmw",
      kind: "number",
      label: "KMW",
      minimum: 0,
      unit: "°KMW",
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
  title: "KMW to Brix Converter",
});
export const runKmwToBrix = kmwToBrixTool.execute;
export default kmwToBrixTool;
