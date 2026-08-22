import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const netFromGrossTool = createSimpleTool({
  id: "finance/net-from-gross",
  title: "Net From Gross Calculator",
  description:
    "Split a gross amount into its net portion and the portion added by a percentage rate.",
  inputs: [
    { id: "gross", label: "Gross amount", kind: "number", minimum: 0 },
    {
      description:
        "Percentage included in the gross, such as VAT or sales tax.",
      id: "ratePercent",
      label: "Included rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    { id: "net", label: "Net amount", kind: "number" },
    { id: "portion", label: "Rate portion", kind: "number" },
  ],
  calculate: (input) => {
    const gross = input.gross as number;
    const rate = (input.ratePercent as number) / 100;
    const net = gross / (1 + rate);
    return { net, portion: gross - net };
  },
});
export const runNetFromGross = netFromGrossTool.execute;
export default netFromGrossTool;

export type NetFromGrossInput = {
  readonly gross: number;
  readonly ratePercent: number;
};

export type NetFromGrossOutput = {
  readonly net: number;
  readonly portion: number;
};

export const netFromGrossExample = {
  input: { gross: 120, ratePercent: 20 },
  output: { net: 100, portion: 20 },
} satisfies ToolExample<NetFromGrossInput, NetFromGrossOutput>;
