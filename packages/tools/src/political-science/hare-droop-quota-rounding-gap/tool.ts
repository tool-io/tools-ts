import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly votes: number; readonly seats: number };
export type Output = {
  readonly hare: number;
  readonly droop: number;
  readonly gap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    votes: { type: "integer", minimum: 0 },
    seats: { type: "integer", minimum: 1 },
  },
  required: ["votes", "seats"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hare: { type: "number" },
    droop: { type: "integer" },
    gap: { type: "number" },
  },
  required: ["hare", "droop", "gap"],
} as const;
/** Compare Hare and integer Droop quota formulas, without selecting an electoral system. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { votes, seats } = request;
  const compute = (): Output => {
    H.integer(votes, 0);
    H.integer(seats, 1);
    return {
      hare: votes / seats,
      droop: Math.floor(votes / (seats + 1)) + 1,
      gap: votes / seats - Math.floor(votes / (seats + 1)) - 1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { votes: 1000, seats: 4 },
  output: { hare: 250, droop: 201, gap: 49 },
} satisfies ToolExample<Input, Output>;
export const hareDroopQuotaRoundingGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "political-science/hare-droop-quota-rounding-gap",
    title: "Hare Droop Quota Rounding Gap Tool",
    description:
      "Compare Hare and integer Droop quota formulas, without selecting an electoral system.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        votes: { type: "integer", minimum: 0 },
        seats: { type: "integer", minimum: 1 },
      },
      required: ["votes", "seats"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        hare: { type: "number" },
        droop: { type: "integer" },
        gap: { type: "number" },
      },
      required: ["hare", "droop", "gap"],
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
          id: "seats",
          label: "Seats",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "hare", label: "Hare", valueType: { type: "number" } },
        { id: "droop", label: "Droop", valueType: { type: "integer" } },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = hareDroopQuotaRoundingGapTool.execute;
export default hareDroopQuotaRoundingGapTool;
