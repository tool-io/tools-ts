import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly seats: number;
  readonly totalSeats: number;
  readonly votes: number;
  readonly totalVotes: number;
};
export type Output = {
  readonly seatShare: number;
  readonly voteShare: number;
  readonly gap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    seats: { type: "integer", minimum: 0 },
    totalSeats: { type: "integer", minimum: 1 },
    votes: { type: "integer", minimum: 0 },
    totalVotes: { type: "integer", minimum: 1 },
  },
  required: ["seats", "totalSeats", "votes", "totalVotes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    seatShare: { type: "number" },
    voteShare: { type: "number" },
    gap: { type: "number" },
  },
  required: ["seatShare", "voteShare", "gap"],
} as const;
/** Calculate seat vote gap contribution from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { seats, totalSeats, votes, totalVotes } = request;
  const compute = (): Output => {
    H.integer(totalSeats, 1);
    H.integer(totalVotes, 1);
    H.integer(seats, 0, totalSeats);
    H.integer(votes, 0, totalVotes);
    return {
      seatShare: seats / totalSeats,
      voteShare: votes / totalVotes,
      gap: seats / totalSeats - votes / totalVotes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { seats: 3, totalSeats: 10, votes: 40, totalVotes: 100 },
  output: { seatShare: 0.3, voteShare: 0.4, gap: -0.10000000000000003 },
} satisfies ToolExample<Input, Output>;
export const seatVoteGapContributionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "political-science/seat-vote-gap-contribution",
    title: "Seat Vote Gap Contribution Tool",
    description:
      "Calculate seat vote gap contribution from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        seats: { type: "integer", minimum: 0 },
        totalSeats: { type: "integer", minimum: 1 },
        votes: { type: "integer", minimum: 0 },
        totalVotes: { type: "integer", minimum: 1 },
      },
      required: ["seats", "totalSeats", "votes", "totalVotes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        seatShare: { type: "number" },
        voteShare: { type: "number" },
        gap: { type: "number" },
      },
      required: ["seatShare", "voteShare", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "seats",
          label: "Seats",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "totalSeats",
          label: "Total Seats",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "votes",
          label: "Votes",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "totalVotes",
          label: "Total Votes",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "seatShare", label: "Seat Share", valueType: { type: "number" } },
        { id: "voteShare", label: "Vote Share", valueType: { type: "number" } },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = seatVoteGapContributionTool.execute;
export default seatVoteGapContributionTool;
