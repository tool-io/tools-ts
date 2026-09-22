import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly currentFraction: number;
  readonly exchangedFractionOfRemainder: number;
};
export type Output = {
  readonly newFraction: number;
  readonly increment: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    currentFraction: { type: "number", minimum: 0, maximum: 1 },
    exchangedFractionOfRemainder: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["currentFraction", "exchangedFractionOfRemainder"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    newFraction: { type: "number" },
    increment: { type: "number" },
  },
  required: ["newFraction", "increment"],
} as const;
/** Accumulate ideal well-mixed replacement fractions without water-quality guidance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { currentFraction, exchangedFractionOfRemainder } = request;
  const compute = (): Output => {
    H.probability(currentFraction);
    H.probability(exchangedFractionOfRemainder);
    return {
      newFraction:
        currentFraction + (1 - currentFraction) * exchangedFractionOfRemainder,
      increment: (1 - currentFraction) * exchangedFractionOfRemainder,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { currentFraction: 0.5, exchangedFractionOfRemainder: 0.25 },
  output: { newFraction: 0.625, increment: 0.125 },
} satisfies ToolExample<Input, Output>;
export const waterExchangeIncrementTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquaculture/water-exchange-increment",
    title: "Water Exchange Increment Tool",
    description:
      "Accumulate ideal well-mixed replacement fractions without water-quality guidance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        currentFraction: { type: "number", minimum: 0, maximum: 1 },
        exchangedFractionOfRemainder: {
          type: "number",
          minimum: 0,
          maximum: 1,
        },
      },
      required: ["currentFraction", "exchangedFractionOfRemainder"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        newFraction: { type: "number" },
        increment: { type: "number" },
      },
      required: ["newFraction", "increment"],
    },
    ports: {
      inputs: [
        {
          id: "currentFraction",
          label: "Current Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "exchangedFractionOfRemainder",
          label: "Exchanged Fraction Of Remainder",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "newFraction",
          label: "New Fraction",
          valueType: { type: "number" },
        },
        { id: "increment", label: "Increment", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = waterExchangeIncrementTool.execute;
export default waterExchangeIncrementTool;
