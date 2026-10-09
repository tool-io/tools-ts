import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly payoffsAgainstOpponentActions: readonly number[];
};
export type Output = {
  readonly guaranteedPayoff: number;
  readonly firstWorstActionIndex: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    payoffsAgainstOpponentActions: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["payoffsAgainstOpponentActions"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    guaranteedPayoff: { type: "number" },
    firstWorstActionIndex: { type: "integer" },
  },
  required: ["guaranteedPayoff", "firstWorstActionIndex"],
} as const;
/** Return one supplied strategy minimum payoff and first minimizing opponent-action index without optimizing over strategies. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { payoffsAgainstOpponentActions } = request;
  const compute = (): Output => {
    return (() => {
      H.domain(
        payoffsAgainstOpponentActions.length > 0,
        "payoffsAgainstOpponentActions",
      );
      const guaranteedPayoff = Math.min(...payoffsAgainstOpponentActions);
      return {
        guaranteedPayoff,
        firstWorstActionIndex:
          payoffsAgainstOpponentActions.indexOf(guaranteedPayoff),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { payoffsAgainstOpponentActions: [4, -2, 6] },
  output: { guaranteedPayoff: -2, firstWorstActionIndex: 1 },
} satisfies ToolExample<Input, Output>;
export const maximinSingleStrategyGuaranteedPayoffTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "game-theory/maximin-single-strategy-guaranteed-payoff",
      title: "Maximin Single Strategy Guaranteed Payoff Tool",
      description:
        "Return one supplied strategy minimum payoff and first minimizing opponent-action index without optimizing over strategies.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          payoffsAgainstOpponentActions: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
        },
        required: ["payoffsAgainstOpponentActions"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          guaranteedPayoff: { type: "number" },
          firstWorstActionIndex: { type: "integer" },
        },
        required: ["guaranteedPayoff", "firstWorstActionIndex"],
      },
      ports: {
        inputs: [
          {
            id: "payoffsAgainstOpponentActions",
            label: "Payoffs Against Opponent Actions",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
        outputs: [
          {
            id: "guaranteedPayoff",
            label: "Guaranteed Payoff",
            valueType: { type: "number" },
          },
          {
            id: "firstWorstActionIndex",
            label: "First Worst Action Index",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = maximinSingleStrategyGuaranteedPayoffTool.execute;
export default maximinSingleStrategyGuaranteedPayoffTool;
