import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly points: number;
  readonly quantum: number;
  readonly roundUp: boolean;
};
export type Output = {
  readonly roundedExpiry: number;
  readonly retained: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    points: { type: "integer", minimum: 0 },
    quantum: { type: "integer", minimum: 1 },
    roundUp: { type: "boolean" },
  },
  required: ["points", "quantum", "roundUp"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    roundedExpiry: { type: "integer" },
    retained: { type: "integer" },
  },
  required: ["roundedExpiry", "retained"],
} as const;
/** Expose signed credit from an explicitly supplied upward/downward expiry quantum rule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { points, quantum, roundUp } = request;
  const compute = (): Output => {
    H.integer(points, 0);
    H.integer(quantum, 1);
    return {
      roundedExpiry:
        (roundUp ? Math.ceil(points / quantum) : Math.floor(points / quantum)) *
        quantum,
      retained:
        points -
        (roundUp ? Math.ceil(points / quantum) : Math.floor(points / quantum)) *
          quantum,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { points: 103, quantum: 10, roundUp: false },
  output: { roundedExpiry: 100, retained: 3 },
} satisfies ToolExample<Input, Output>;
export const loyaltyExpiryRoundingCreditTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "marketing/loyalty-expiry-rounding-credit",
    title: "Loyalty Expiry Rounding Credit Tool",
    description:
      "Expose signed credit from an explicitly supplied upward/downward expiry quantum rule.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        points: { type: "integer", minimum: 0 },
        quantum: { type: "integer", minimum: 1 },
        roundUp: { type: "boolean" },
      },
      required: ["points", "quantum", "roundUp"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        roundedExpiry: { type: "integer" },
        retained: { type: "integer" },
      },
      required: ["roundedExpiry", "retained"],
    },
    ports: {
      inputs: [
        {
          id: "points",
          label: "Points",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "quantum",
          label: "Quantum",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "roundUp",
          label: "Round Up",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "roundedExpiry",
          label: "Rounded Expiry",
          valueType: { type: "integer" },
        },
        { id: "retained", label: "Retained", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = loyaltyExpiryRoundingCreditTool.execute;
export default loyaltyExpiryRoundingCreditTool;
