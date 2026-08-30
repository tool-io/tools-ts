import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const gapStrategies = {
  affordability: {
    evidenceTarget:
      "Demonstrate a credible total-cost case for the intended adopter segment.",
    strategy: "Reduce or restructure the total cost of ownership.",
  },
  compatibility: {
    evidenceTarget:
      "Demonstrate reliable integration with the adopter's existing workflow and systems.",
    strategy: "Add adapters, interoperability, and migration support.",
  },
  credibility: {
    evidenceTarget:
      "Provide independent evidence under conditions close to operational use.",
    strategy: "Build a credible proof under realistic constraints.",
  },
  usability: {
    evidenceTarget:
      "Demonstrate that a complete workflow is learnable and repeatable by the target segment.",
    strategy: "Complete the product experience and remove adoption friction.",
  },
  value: {
    evidenceTarget:
      "Demonstrate a measurable advantage against the adopter's current alternative.",
    strategy:
      "Focus positioning and packaging on a complete, measurable value case.",
  },
} as const;

export type ChasmGapType = keyof typeof gapStrategies;

export type CrossingTheChasmInput = {
  readonly gapType: ChasmGapType;
};

export type CrossingTheChasmOutput = {
  readonly evidenceTarget: string;
  readonly gapType: ChasmGapType;
  readonly recommendedStrategy: string;
};

export const lookupEarlyMajorityGapStrategy = (
  input: CrossingTheChasmInput,
): CrossingTheChasmOutput => {
  const strategy = gapStrategies[input.gapType];
  if (strategy === undefined)
    simpleError(
      "gapType",
      "Gap type is not supported.",
      "unsupported_gap_type",
    );
  return {
    evidenceTarget: strategy.evidenceTarget,
    gapType: input.gapType,
    recommendedStrategy: strategy.strategy,
  };
};

export const crossingTheChasmExample = {
  input: { gapType: "usability" },
  output: {
    evidenceTarget:
      "Demonstrate that a complete workflow is learnable and repeatable by the target segment.",
    gapType: "usability",
    recommendedStrategy:
      "Complete the product experience and remove adoption friction.",
  },
} satisfies ToolExample<CrossingTheChasmInput, CrossingTheChasmOutput>;

export const crossingTheChasmTool = createSimpleTool({
  calculate: (input) =>
    lookupEarlyMajorityGapStrategy({ gapType: input.gapType as ChasmGapType }),
  description:
    "Return a generic early-majority gap strategy and evidence target for a caller-selected adoption barrier.",
  id: "futurology/crossing-the-chasm-early-majority-gap-strategy-lookup",
  inputs: [
    {
      enum: [
        "affordability",
        "compatibility",
        "credibility",
        "usability",
        "value",
      ],
      id: "gapType",
      kind: "string",
      label: "Adoption gap type",
    },
  ],
  outputs: [
    { id: "evidenceTarget", kind: "string", label: "Evidence target" },
    { id: "gapType", kind: "string", label: "Adoption gap type" },
    {
      id: "recommendedStrategy",
      kind: "string",
      label: "Recommended strategy",
    },
  ],
  title: "Crossing the Chasm Early Majority Gap Strategy Lookup",
});

export const runCrossingTheChasm = crossingTheChasmTool.execute;
export default crossingTheChasmTool;
