import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly demandIntercept: number;
  readonly slope: number;
  readonly marginalCost: number;
  readonly leaderQuantity: number;
};
export type Output = { readonly followerQuantity: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    demandIntercept: { type: "number" },
    slope: { type: "number", exclusiveMinimum: 0 },
    marginalCost: { type: "number" },
    leaderQuantity: { type: "number", minimum: 0 },
  },
  required: ["demandIntercept", "slope", "marginalCost", "leaderQuantity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { followerQuantity: { type: "number" } },
  required: ["followerQuantity"],
} as const;
/** Calculate stackelberg follower reaction point from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { demandIntercept, slope, marginalCost, leaderQuantity } = request;
  const compute = (): Output => {
    H.positive(slope);
    H.domain(leaderQuantity >= 0);
    return {
      followerQuantity: Math.max(
        0,
        (demandIntercept - marginalCost - slope * leaderQuantity) / (2 * slope),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    demandIntercept: 100,
    slope: 2,
    marginalCost: 20,
    leaderQuantity: 10,
  },
  output: { followerQuantity: 15 },
} satisfies ToolExample<Input, Output>;
export const stackelbergFollowerReactionPointTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economics/stackelberg-follower-reaction-point",
    title: "Stackelberg Follower Reaction Point Tool",
    description:
      "Calculate stackelberg follower reaction point from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        demandIntercept: { type: "number" },
        slope: { type: "number", exclusiveMinimum: 0 },
        marginalCost: { type: "number" },
        leaderQuantity: { type: "number", minimum: 0 },
      },
      required: ["demandIntercept", "slope", "marginalCost", "leaderQuantity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { followerQuantity: { type: "number" } },
      required: ["followerQuantity"],
    },
    ports: {
      inputs: [
        {
          id: "demandIntercept",
          label: "Demand Intercept",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "slope",
          label: "Slope",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "marginalCost",
          label: "Marginal Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "leaderQuantity",
          label: "Leader Quantity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "followerQuantity",
          label: "Follower Quantity",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = stackelbergFollowerReactionPointTool.execute;
export default stackelbergFollowerReactionPointTool;
