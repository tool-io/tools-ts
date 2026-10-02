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
/** Calculate d hondt one quotient next seat from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { votes, seatsWon } = request;
  const compute = (): Output => {
    H.integer(votes, 0);
    H.integer(seatsWon, 0);
    return { divisor: seatsWon + 1, quotient: votes / (seatsWon + 1) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { votes: 1200, seatsWon: 2 },
  output: { divisor: 3, quotient: 400 },
} satisfies ToolExample<Input, Output>;
export const dHondtOneQuotientNextSeatTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "political-science/d-hondt-one-quotient-next-seat",
    title: "D Hondt One Quotient Next Seat Tool",
    description:
      "Calculate d hondt one quotient next seat from explicit caller-supplied inputs.",
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
export const run = dHondtOneQuotientNextSeatTool.execute;
export default dHondtOneQuotientNextSeatTool;
