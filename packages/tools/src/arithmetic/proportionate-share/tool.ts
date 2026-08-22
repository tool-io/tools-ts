import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const proportionateShareExample = {
  input: { ratio: 3, sharesTotal: 4, totalAmount: 200 },
  output: { share: 150 },
} satisfies ToolExample<ProportionateShareInput, ProportionateShareOutput>;

type ProportionateShareInput = {
  readonly ratio: number;
  readonly sharesTotal: number;
  readonly totalAmount: number;
};
type ProportionateShareOutput = { readonly share: number };

export const calculateProportionateShare = (
  input: ProportionateShareInput,
): ProportionateShareOutput => {
  if (input.sharesTotal <= 0)
    simpleError(
      "sharesTotal",
      "The total of all shares must be positive.",
      "invalid_shares",
    );
  return {
    share: (input.ratio / input.sharesTotal) * input.totalAmount,
  };
};

export const proportionateShareTool = createSimpleTool({
  calculate: (input) =>
    calculateProportionateShare(input as unknown as ProportionateShareInput),
  description: "Compute one party's proportionate share of a total amount.",
  id: "arithmetic/proportionate-share",
  inputs: [
    { id: "ratio", kind: "number", label: "This party's ratio" },
    {
      id: "sharesTotal",
      kind: "number",
      label: "Sum of all ratios",
      minimum: 0,
    },
    { id: "totalAmount", kind: "number", label: "Total to divide" },
  ],
  outputs: [{ id: "share", kind: "number", label: "Share" }],
  title: "Proportionate Share Calculator",
});
export const runProportionateShare = proportionateShareTool.execute;
export default proportionateShareTool;
