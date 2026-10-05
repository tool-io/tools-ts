import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coalitionSeats: number;
  readonly totalSeats: number;
};
export type Output = {
  readonly majorityRequired: number;
  readonly margin: number;
  readonly hasMajority: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coalitionSeats: { type: "integer", minimum: 0 },
    totalSeats: { type: "integer", minimum: 1 },
  },
  required: ["coalitionSeats", "totalSeats"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    majorityRequired: { type: "integer" },
    margin: { type: "integer" },
    hasMajority: { type: "boolean" },
  },
  required: ["majorityRequired", "margin", "hasMajority"],
} as const;
/** Compare a coalition seat count with a strict majority of all seats; abstentions, vacancies and special voting rules are not modelled. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coalitionSeats, totalSeats } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(totalSeats) &&
        totalSeats >= 1 &&
        totalSeats <= Number.MAX_SAFE_INTEGER,
      "totalSeats",
    ),
      totalSeats);
    (H.domain(
      Number.isSafeInteger(coalitionSeats) &&
        coalitionSeats >= 0 &&
        coalitionSeats <= totalSeats,
      "coalitionSeats",
    ),
      coalitionSeats);
    return (() => {
      const majorityRequired = Math.floor(totalSeats / 2) + 1;
      return {
        majorityRequired,
        margin: coalitionSeats - majorityRequired,
        hasMajority: coalitionSeats >= majorityRequired,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coalitionSeats: 51, totalSeats: 100 },
  output: { majorityRequired: 51, margin: 0, hasMajority: true },
} satisfies ToolExample<Input, Output>;
export const coalitionSeatMajorityMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "political-science/coalition-seat-majority-margin",
    title: "Coalition Seat Majority Margin Tool",
    description:
      "Compare a coalition seat count with a strict majority of all seats; abstentions, vacancies and special voting rules are not modelled.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coalitionSeats: { type: "integer", minimum: 0 },
        totalSeats: { type: "integer", minimum: 1 },
      },
      required: ["coalitionSeats", "totalSeats"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        majorityRequired: { type: "integer" },
        margin: { type: "integer" },
        hasMajority: { type: "boolean" },
      },
      required: ["majorityRequired", "margin", "hasMajority"],
    },
    ports: {
      inputs: [
        {
          id: "coalitionSeats",
          label: "Coalition Seats",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "totalSeats",
          label: "Total Seats",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "majorityRequired",
          label: "Majority Required",
          valueType: { type: "integer" },
        },
        { id: "margin", label: "Margin", valueType: { type: "integer" } },
        {
          id: "hasMajority",
          label: "Has Majority",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = coalitionSeatMajorityMarginTool.execute;
export default coalitionSeatMajorityMarginTool;
