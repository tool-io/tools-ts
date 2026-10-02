import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly votes: number; readonly seatsWon: number };
export type Output = { readonly divisor: number; readonly quotient: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    votes: { type: "integer", minimum: 0 },
    seatsWon: { type: "integer", minimum: 0 },
  },
  required: ["votes", "seatsWon"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { divisor: { type: "integer" }, quotient: { type: "number" } },
  required: ["divisor", "quotient"],
} as const;
/** Unmodified odd-divisor Sainte-Lague quotient; no special first divisor is assumed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { votes, seatsWon } = request;
  const compute = (): Output => {
    H.integer(votes, 0);
    H.integer(seatsWon, 0);
    return { divisor: 2 * seatsWon + 1, quotient: votes / (2 * seatsWon + 1) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { votes: 1200, seatsWon: 2 },
  output: { divisor: 5, quotient: 240 },
} satisfies ToolExample<Input, Output>;
export const sainteLagueOneDivisorStepTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "political-science/sainte-lague-one-divisor-step",
    title: "Sainte Lague One Divisor Step Tool",
    description:
      "Unmodified odd-divisor Sainte-Lague quotient; no special first divisor is assumed.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        votes: { type: "integer", minimum: 0 },
        seatsWon: { type: "integer", minimum: 0 },
      },
      required: ["votes", "seatsWon"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        divisor: { type: "integer" },
        quotient: { type: "number" },
      },
      required: ["divisor", "quotient"],
    },
    ports: {
      inputs: [
        {
          id: "votes",
          label: "Votes",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "seatsWon",
          label: "Seats Won",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "divisor", label: "Divisor", valueType: { type: "integer" } },
        { id: "quotient", label: "Quotient", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = sainteLagueOneDivisorStepTool.execute;
export default sainteLagueOneDivisorStepTool;
