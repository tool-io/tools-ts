import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BidAskSpreadPercentInput = Readonly<{
  readonly askPrice: number;
  readonly bidPrice: number;
}>;
export type BidAskSpreadPercentOutput = Readonly<{
  readonly spreadPercentOfMid: number;
}>;

export const calculateBidAskSpreadPercent = (
  x: BidAskSpreadPercentInput,
): BidAskSpreadPercentOutput => {
  if (!Number.isFinite(x.askPrice) || x.askPrice < 0)
    simpleError("askPrice", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.bidPrice) || x.bidPrice < 0)
    simpleError("bidPrice", "Provide a finite nonnegative number.");
  if (x.askPrice < x.bidPrice)
    simpleError("askPrice", "Ask price must be at least the bid price.");
  if (x.askPrice + x.bidPrice === 0)
    simpleError("askPrice", "At least one quoted price must be positive.");
  const spreadPercentOfMid =
    ((x.askPrice - x.bidPrice) / ((x.askPrice + x.bidPrice) / 2)) * 100;
  if (!Number.isFinite(spreadPercentOfMid))
    simpleError(
      "spreadPercentOfMid",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    spreadPercentOfMid: Object.is(spreadPercentOfMid, -0)
      ? 0
      : spreadPercentOfMid,
  };
};

export const example = {
  input: {
    askPrice: 110,
    bidPrice: 100,
  },
  output: { spreadPercentOfMid: 9.523809523809524 },
} satisfies ToolExample<BidAskSpreadPercentInput, BidAskSpreadPercentOutput>;

export const tool = createSimpleTool({
  id: "numismatics/bid-ask-spread-percent",
  title: "Bid Ask Spread Percent",
  description:
    "Calculate quoted bid-ask spread as a percentage of the midpoint, not the bid.",
  inputs: [
    { id: "askPrice", kind: "number", label: "Ask Price", unit: "currency" },
    { id: "bidPrice", kind: "number", label: "Bid Price", unit: "currency" },
  ],
  outputs: [
    {
      id: "spreadPercentOfMid",
      kind: "number",
      label: "Spread Percent Of Mid",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateBidAskSpreadPercent({
      askPrice: input.askPrice as number,
      bidPrice: input.bidPrice as number,
    }),
});
export const runBidAskSpreadPercent = tool.execute;
export default tool;
