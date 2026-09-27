import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly allocation: number;
  readonly disagreement: number;
  readonly weight: number;
};
export type Output = {
  readonly surplus: number;
  readonly logObjectiveContribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    allocation: { type: "number" },
    disagreement: { type: "number" },
    weight: { type: "number", minimum: 0 },
  },
  required: ["allocation", "disagreement", "weight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    surplus: { type: "number" },
    logObjectiveContribution: { type: "number" },
  },
  required: ["surplus", "logObjectiveContribution"],
} as const;
/** One weighted log surplus term in a generalized Nash bargaining objective. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { allocation, disagreement, weight } = request;
  const compute = (): Output => {
    H.domain(allocation > disagreement && weight >= 0);
    return {
      surplus: allocation - disagreement,
      logObjectiveContribution: weight * Math.log(allocation - disagreement),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { allocation: 12, disagreement: 2, weight: 0.5 },
  output: { surplus: 10, logObjectiveContribution: 1.151292546497023 },
} satisfies ToolExample<Input, Output>;
export const bargainingWeightedLogsurplusOnePartyTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "game-theory/bargaining-weighted-logsurplus-one-party-term",
      title: "Bargaining Weighted Logsurplus One Party Term Tool",
      description:
        "One weighted log surplus term in a generalized Nash bargaining objective.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          allocation: { type: "number" },
          disagreement: { type: "number" },
          weight: { type: "number", minimum: 0 },
        },
        required: ["allocation", "disagreement", "weight"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          surplus: { type: "number" },
          logObjectiveContribution: { type: "number" },
        },
        required: ["surplus", "logObjectiveContribution"],
      },
      ports: {
        inputs: [
          {
            id: "allocation",
            label: "Allocation",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "disagreement",
            label: "Disagreement",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "weight",
            label: "Weight",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "surplus", label: "Surplus", valueType: { type: "number" } },
          {
            id: "logObjectiveContribution",
            label: "Log Objective Contribution",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = bargainingWeightedLogsurplusOnePartyTermTool.execute;
export default bargainingWeightedLogsurplusOnePartyTermTool;
