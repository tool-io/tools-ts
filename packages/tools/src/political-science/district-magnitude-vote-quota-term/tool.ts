import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly validVotes: number; readonly seats: number };
export type Output = { readonly votesPerSeat: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    validVotes: { type: "integer", minimum: 0 },
    seats: { type: "integer", minimum: 1 },
  },
  required: ["validVotes", "seats"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { votesPerSeat: { type: "number" } },
  required: ["votesPerSeat"],
} as const;
/** Hare votes-per-seat quotient on an explicit valid-vote base. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { validVotes, seats } = request;
  const compute = (): Output => {
    H.integer(validVotes, 0);
    H.integer(seats, 1);
    return { votesPerSeat: validVotes / seats };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { validVotes: 10000, seats: 5 },
  output: { votesPerSeat: 2000 },
} satisfies ToolExample<Input, Output>;
export const districtMagnitudeVoteQuotaTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "political-science/district-magnitude-vote-quota-term",
    title: "District Magnitude Vote Quota Term Tool",
    description: "Hare votes-per-seat quotient on an explicit valid-vote base.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        validVotes: { type: "integer", minimum: 0 },
        seats: { type: "integer", minimum: 1 },
      },
      required: ["validVotes", "seats"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { votesPerSeat: { type: "number" } },
      required: ["votesPerSeat"],
    },
    ports: {
      inputs: [
        {
          id: "validVotes",
          label: "Valid Votes",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "seats",
          label: "Seats",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "votesPerSeat",
          label: "Votes Per Seat",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = districtMagnitudeVoteQuotaTermTool.execute;
export default districtMagnitudeVoteQuotaTermTool;
