import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type InterveningOpportunitiesStoufferIndexInput = {
  readonly destinationOpportunities: number;
  readonly interveningOpportunities: number;
};

export type InterveningOpportunitiesStoufferIndexOutput = {
  readonly opportunityRatio: number;
};

export const interveningOpportunitiesStoufferIndexExample = {
  input: {
    destinationOpportunities: 2000,
    interveningOpportunities: 40000,
  },
  output: {
    opportunityRatio: 0.05,
  },
} satisfies ToolExample<
  InterveningOpportunitiesStoufferIndexInput,
  InterveningOpportunitiesStoufferIndexOutput
>;

export const calculateInterveningOpportunities = (
  input: InterveningOpportunitiesStoufferIndexInput,
): InterveningOpportunitiesStoufferIndexOutput => {
  if (
    !Number.isFinite(input.destinationOpportunities) ||
    input.destinationOpportunities < 0
  )
    simpleError(
      "destinationOpportunities",
      "Destination opportunities must be a finite nonnegative number.",
      "invalid_value",
    );
  if (
    !Number.isFinite(input.interveningOpportunities) ||
    input.interveningOpportunities <= 0
  )
    simpleError(
      "interveningOpportunities",
      "At least one finite intervening opportunity is required for the ratio.",
      "invalid_value",
    );
  return {
    opportunityRatio:
      input.destinationOpportunities / input.interveningOpportunities,
  };
};

export const interveningOpportunitiesStoufferIndexTool = createSimpleTool({
  calculate: (input) =>
    calculateInterveningOpportunities({
      destinationOpportunities: input.destinationOpportunities as number,
      interveningOpportunities: input.interveningOpportunities as number,
    }),
  description:
    "Compute an access-ratio heuristic as opportunities at a destination divided by opportunities encountered before it; this is not the cumulative Stouffer formulation for migration probability.",
  id: "sociology/intervening-opportunities-stouffer-index",
  inputs: [
    {
      description:
        "Opportunity sites available at the destination, using the same definition as the intervening count.",
      id: "destinationOpportunities",
      kind: "number",
      label: "Destination opportunities",
      minimum: 0,
    },
    {
      description:
        "Cumulative comparable opportunities between the origin and destination.",
      id: "interveningOpportunities",
      kind: "number",
      label: "Intervening opportunities",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      description:
        "Intervening opportunities available per kilometer of remaining path.",
      id: "opportunityRatio",
      kind: "number",
      label: "Opportunity ratio",
    },
  ],
  title: "Stouffer Intervening Opportunities Access Ratio Calculator",
});
export const runInterveningOpportunitiesStoufferIndex =
  interveningOpportunitiesStoufferIndexTool.execute;
export default interveningOpportunitiesStoufferIndexTool;
