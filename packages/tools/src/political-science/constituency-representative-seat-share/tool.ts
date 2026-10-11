import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly constituencySeats: number;
  readonly totalSeats: number;
};
export type Output = { readonly seatShare: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    constituencySeats: { type: "integer", minimum: 0 },
    totalSeats: { type: "integer", minimum: 1 },
  },
  required: ["constituencySeats", "totalSeats"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { seatShare: { type: "number" } },
  required: ["seatShare"],
} as const;
/** Normalize an explicit constituency seat count to a positive total without measuring voter representation or fairness. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { constituencySeats, totalSeats } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(totalSeats) &&
        totalSeats >= 1 &&
        totalSeats <= Number.MAX_SAFE_INTEGER,
      "totalSeats",
    ),
      totalSeats);
    (H.domain(
      Number.isSafeInteger(constituencySeats) &&
        constituencySeats >= 0 &&
        constituencySeats <= totalSeats,
      "constituencySeats",
    ),
      constituencySeats);
    return { seatShare: constituencySeats / totalSeats };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { constituencySeats: 3, totalSeats: 12 },
  output: { seatShare: 0.25 },
} satisfies ToolExample<Input, Output>;
export const constituencyRepresentativeSeatShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["political-science", "political science", "social sciences"],
        keywords: ["political science", "social sciences"],
      },
      id: "political-science/constituency-representative-seat-share",
      title: "Constituency Representative Seat Share",
      description:
        "Normalize an explicit constituency seat count to a positive total without measuring voter representation or fairness.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          constituencySeats: { type: "integer", minimum: 0 },
          totalSeats: { type: "integer", minimum: 1 },
        },
        required: ["constituencySeats", "totalSeats"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { seatShare: { type: "number" } },
        required: ["seatShare"],
      },
      ports: {
        inputs: [
          {
            id: "constituencySeats",
            label: "Constituency Seats",
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
            id: "seatShare",
            label: "Seat Share",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = constituencyRepresentativeSeatShareTool.execute;
export default constituencyRepresentativeSeatShareTool;
