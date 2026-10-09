import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstPayoff: number;
  readonly secondPayoff: number;
  readonly firstDisagreement: number;
  readonly secondDisagreement: number;
};
export type Output = {
  readonly firstSurplus: number;
  readonly secondSurplus: number;
  readonly bothNonnegative: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstPayoff: { type: "number" },
    secondPayoff: { type: "number" },
    firstDisagreement: { type: "number" },
    secondDisagreement: { type: "number" },
  },
  required: [
    "firstPayoff",
    "secondPayoff",
    "firstDisagreement",
    "secondDisagreement",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstSurplus: { type: "number" },
    secondSurplus: { type: "number" },
    bothNonnegative: { type: "boolean" },
  },
  required: ["firstSurplus", "secondSurplus", "bothNonnegative"],
} as const;
/** Compare explicit bargaining payoffs to supplied disagreement payoffs without selecting a bargaining solution. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstPayoff, secondPayoff, firstDisagreement, secondDisagreement } =
    request;
  const compute = (): Output => {
    return {
      firstSurplus: firstPayoff - firstDisagreement,
      secondSurplus: secondPayoff - secondDisagreement,
      bothNonnegative:
        firstPayoff >= firstDisagreement && secondPayoff >= secondDisagreement,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstPayoff: 8,
    secondPayoff: 7,
    firstDisagreement: 3,
    secondDisagreement: 2,
  },
  output: { firstSurplus: 5, secondSurplus: 5, bothNonnegative: true },
} satisfies ToolExample<Input, Output>;
export const bargainingDisagreementSurplusTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["game-theory", "game theory", "economics"],
      keywords: ["game theory", "economics"],
    },
    id: "game-theory/bargaining-disagreement-surplus",
    title: "Bargaining Disagreement Surplus",
    description:
      "Compare explicit bargaining payoffs to supplied disagreement payoffs without selecting a bargaining solution.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstPayoff: { type: "number" },
        secondPayoff: { type: "number" },
        firstDisagreement: { type: "number" },
        secondDisagreement: { type: "number" },
      },
      required: [
        "firstPayoff",
        "secondPayoff",
        "firstDisagreement",
        "secondDisagreement",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstSurplus: { type: "number" },
        secondSurplus: { type: "number" },
        bothNonnegative: { type: "boolean" },
      },
      required: ["firstSurplus", "secondSurplus", "bothNonnegative"],
    },
    ports: {
      inputs: [
        {
          id: "firstPayoff",
          label: "First Payoff",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondPayoff",
          label: "Second Payoff",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstDisagreement",
          label: "First Disagreement",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondDisagreement",
          label: "Second Disagreement",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "firstSurplus",
          label: "First Surplus",
          valueType: { type: "number" },
        },
        {
          id: "secondSurplus",
          label: "Second Surplus",
          valueType: { type: "number" },
        },
        {
          id: "bothNonnegative",
          label: "Both Nonnegative",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = bargainingDisagreementSurplusTool.execute;
export default bargainingDisagreementSurplusTool;
