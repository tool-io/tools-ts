import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly groupSeats: number;
  readonly totalSeats: number;
  readonly populationFraction: number;
};
export type Output = {
  readonly seatFraction: number;
  readonly gap: number;
  readonly parityRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    groupSeats: { type: "integer", minimum: 0 },
    totalSeats: { type: "integer", minimum: 1 },
    populationFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: ["groupSeats", "totalSeats", "populationFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    seatFraction: { type: "number" },
    gap: { type: "number" },
    parityRatio: { type: "number" },
  },
  required: ["seatFraction", "gap", "parityRatio"],
} as const;
/** Calculate representation parity seat share gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { groupSeats, totalSeats, populationFraction } = request;
  const compute = (): Output => {
    H.integer(totalSeats, 1);
    H.integer(groupSeats, 0, totalSeats);
    H.domain(populationFraction > 0 && populationFraction <= 1);
    return {
      seatFraction: groupSeats / totalSeats,
      gap: groupSeats / totalSeats - populationFraction,
      parityRatio: groupSeats / totalSeats / populationFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { groupSeats: 30, totalSeats: 100, populationFraction: 0.5 },
  output: { seatFraction: 0.3, gap: -0.2, parityRatio: 0.6 },
} satisfies ToolExample<Input, Output>;
export const representationParitySeatShareGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "political-science/representation-parity-seat-share-gap",
    title: "Representation Parity Seat Share Gap Tool",
    description:
      "Calculate representation parity seat share gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        groupSeats: { type: "integer", minimum: 0 },
        totalSeats: { type: "integer", minimum: 1 },
        populationFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
      },
      required: ["groupSeats", "totalSeats", "populationFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        seatFraction: { type: "number" },
        gap: { type: "number" },
        parityRatio: { type: "number" },
      },
      required: ["seatFraction", "gap", "parityRatio"],
    },
    ports: {
      inputs: [
        {
          id: "groupSeats",
          label: "Group Seats",
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
          id: "populationFraction",
          label: "Population Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "seatFraction",
          label: "Seat Fraction",
          valueType: { type: "number" },
        },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
        {
          id: "parityRatio",
          label: "Parity Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = representationParitySeatShareGapTool.execute;
export default representationParitySeatShareGapTool;
