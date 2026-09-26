import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly feedFlow: number;
  readonly recovery: number;
  readonly feedConcentration: number;
  readonly rejection: number;
};
export type Output = {
  readonly permeateFlow: number;
  readonly concentrateFlow: number;
  readonly permeateConcentration: number;
  readonly concentrateConcentration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    feedFlow: { type: "number", minimum: 0 },
    recovery: { type: "number", minimum: 0, exclusiveMaximum: 1 },
    feedConcentration: { type: "number", minimum: 0 },
    rejection: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["feedFlow", "recovery", "feedConcentration", "rejection"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    permeateFlow: { type: "number" },
    concentrateFlow: { type: "number" },
    permeateConcentration: { type: "number" },
    concentrateConcentration: { type: "number" },
  },
  required: [
    "permeateFlow",
    "concentrateFlow",
    "permeateConcentration",
    "concentrateConcentration",
  ],
} as const;
/** Steady water and salt balances, with rejection defined relative to bulk feed concentration and no density change. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { feedFlow, recovery, feedConcentration, rejection } = request;
  const compute = (): Output => {
    H.domain(
      feedFlow >= 0 && recovery >= 0 && recovery < 1 && feedConcentration >= 0,
    );
    H.probability(rejection);
    return {
      permeateFlow: feedFlow * recovery,
      concentrateFlow: feedFlow * (1 - recovery),
      permeateConcentration: feedConcentration * (1 - rejection),
      concentrateConcentration:
        (feedConcentration * (1 - recovery * (1 - rejection))) / (1 - recovery),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    feedFlow: 100,
    recovery: 0.5,
    feedConcentration: 1000,
    rejection: 0.9,
  },
  output: {
    permeateFlow: 50,
    concentrateFlow: 50,
    permeateConcentration: 99.99999999999997,
    concentrateConcentration: 1900,
  },
} satisfies ToolExample<Input, Output>;
export const reverseOsmosisPermeateRecoverySaltFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "environmental-engineering/reverse-osmosis-permeate-recovery-salt-factor",
      title: "Reverse Osmosis Permeate Recovery Salt Factor Tool",
      description:
        "Steady water and salt balances, with rejection defined relative to bulk feed concentration and no density change.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          feedFlow: { type: "number", minimum: 0 },
          recovery: { type: "number", minimum: 0, exclusiveMaximum: 1 },
          feedConcentration: { type: "number", minimum: 0 },
          rejection: { type: "number", minimum: 0, maximum: 1 },
        },
        required: ["feedFlow", "recovery", "feedConcentration", "rejection"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          permeateFlow: { type: "number" },
          concentrateFlow: { type: "number" },
          permeateConcentration: { type: "number" },
          concentrateConcentration: { type: "number" },
        },
        required: [
          "permeateFlow",
          "concentrateFlow",
          "permeateConcentration",
          "concentrateConcentration",
        ],
      },
      ports: {
        inputs: [
          {
            id: "feedFlow",
            label: "Feed Flow",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "recovery",
            label: "Recovery",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "feedConcentration",
            label: "Feed Concentration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "rejection",
            label: "Rejection",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "permeateFlow",
            label: "Permeate Flow",
            valueType: { type: "number" },
          },
          {
            id: "concentrateFlow",
            label: "Concentrate Flow",
            valueType: { type: "number" },
          },
          {
            id: "permeateConcentration",
            label: "Permeate Concentration",
            valueType: { type: "number" },
          },
          {
            id: "concentrateConcentration",
            label: "Concentrate Concentration",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = reverseOsmosisPermeateRecoverySaltFactorTool.execute;
export default reverseOsmosisPermeateRecoverySaltFactorTool;
