import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly usersBefore: number;
  readonly latencyAfterJoin: number;
  readonly entrantValue: number;
};
export type Output = {
  readonly potentialIncrement: number;
  readonly entrantNetPayoff: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    usersBefore: { type: "integer", minimum: 0 },
    latencyAfterJoin: { type: "number" },
    entrantValue: { type: "number" },
  },
  required: ["usersBefore", "latencyAfterJoin", "entrantValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    potentialIncrement: { type: "number" },
    entrantNetPayoff: { type: "number" },
  },
  required: ["potentialIncrement", "entrantNetPayoff"],
} as const;
/** One unweighted Rosenthal resource potential increment equals latency at usersBefore+1; latency is supplied, not inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { usersBefore, latencyAfterJoin, entrantValue } = request;
  const compute = (): Output => {
    H.integer(usersBefore, 0);
    return {
      potentialIncrement: latencyAfterJoin,
      entrantNetPayoff: entrantValue - latencyAfterJoin,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { usersBefore: 3, latencyAfterJoin: 5, entrantValue: 8 },
  output: { potentialIncrement: 5, entrantNetPayoff: 3 },
} satisfies ToolExample<Input, Output>;
export const congestionPotentialOneUserIncrementTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "game-theory/congestion-potential-one-user-increment",
      title: "Congestion Potential One User Increment Tool",
      description:
        "One unweighted Rosenthal resource potential increment equals latency at usersBefore+1; latency is supplied, not inferred.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          usersBefore: { type: "integer", minimum: 0 },
          latencyAfterJoin: { type: "number" },
          entrantValue: { type: "number" },
        },
        required: ["usersBefore", "latencyAfterJoin", "entrantValue"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          potentialIncrement: { type: "number" },
          entrantNetPayoff: { type: "number" },
        },
        required: ["potentialIncrement", "entrantNetPayoff"],
      },
      ports: {
        inputs: [
          {
            id: "usersBefore",
            label: "Users Before",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "latencyAfterJoin",
            label: "Latency After Join",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "entrantValue",
            label: "Entrant Value",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "potentialIncrement",
            label: "Potential Increment",
            valueType: { type: "number" },
          },
          {
            id: "entrantNetPayoff",
            label: "Entrant Net Payoff",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = congestionPotentialOneUserIncrementTool.execute;
export default congestionPotentialOneUserIncrementTool;
