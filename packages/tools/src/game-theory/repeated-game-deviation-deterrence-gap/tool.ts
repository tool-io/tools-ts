import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cooperationPayoff: number;
  readonly deviationPayoff: number;
  readonly punishmentPayoff: number;
  readonly discountFactor: number;
};
export type Output = {
  readonly normalizedDeterrenceGap: number;
  readonly cooperationDetersDeviation: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cooperationPayoff: { type: "number" },
    deviationPayoff: { type: "number" },
    punishmentPayoff: { type: "number" },
    discountFactor: { type: "number", minimum: 0, exclusiveMaximum: 1 },
  },
  required: [
    "cooperationPayoff",
    "deviationPayoff",
    "punishmentPayoff",
    "discountFactor",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normalizedDeterrenceGap: { type: "number" },
    cooperationDetersDeviation: { type: "boolean" },
  },
  required: ["normalizedDeterrenceGap", "cooperationDetersDeviation"],
} as const;
/** Check an explicit infinite-horizon one-shot deviation incentive with constant cooperative and punishment payoffs, normalized by one minus discount factor. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    cooperationPayoff,
    deviationPayoff,
    punishmentPayoff,
    discountFactor,
  } = request;
  const compute = (): Output => {
    H.domain(discountFactor >= 0 && discountFactor < 1, "discountFactor");
    return (() => {
      const normalizedDeterrenceGap =
        cooperationPayoff -
        (1 - discountFactor) * deviationPayoff -
        discountFactor * punishmentPayoff;
      return {
        normalizedDeterrenceGap,
        cooperationDetersDeviation: normalizedDeterrenceGap >= 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    cooperationPayoff: 3,
    deviationPayoff: 5,
    punishmentPayoff: 1,
    discountFactor: 0.75,
  },
  output: { normalizedDeterrenceGap: 1, cooperationDetersDeviation: true },
} satisfies ToolExample<Input, Output>;
export const repeatedGameDeviationDeterrenceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "game-theory/repeated-game-deviation-deterrence-gap",
    title: "Repeated Game Deviation Deterrence Gap Tool",
    description:
      "Check an explicit infinite-horizon one-shot deviation incentive with constant cooperative and punishment payoffs, normalized by one minus discount factor.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cooperationPayoff: { type: "number" },
        deviationPayoff: { type: "number" },
        punishmentPayoff: { type: "number" },
        discountFactor: { type: "number", minimum: 0, exclusiveMaximum: 1 },
      },
      required: [
        "cooperationPayoff",
        "deviationPayoff",
        "punishmentPayoff",
        "discountFactor",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        normalizedDeterrenceGap: { type: "number" },
        cooperationDetersDeviation: { type: "boolean" },
      },
      required: ["normalizedDeterrenceGap", "cooperationDetersDeviation"],
    },
    ports: {
      inputs: [
        {
          id: "cooperationPayoff",
          label: "Cooperation Payoff",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "deviationPayoff",
          label: "Deviation Payoff",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "punishmentPayoff",
          label: "Punishment Payoff",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "discountFactor",
          label: "Discount Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "normalizedDeterrenceGap",
          label: "Normalized Deterrence Gap",
          valueType: { type: "number" },
        },
        {
          id: "cooperationDetersDeviation",
          label: "Cooperation Deters Deviation",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = repeatedGameDeviationDeterrenceGapTool.execute;
export default repeatedGameDeviationDeterrenceGapTool;
