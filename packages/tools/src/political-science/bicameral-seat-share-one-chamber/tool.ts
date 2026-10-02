import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly partySeats: number;
  readonly occupiedSeats: number;
  readonly vacantSeats: number;
  readonly includeVacancies: boolean;
};
export type Output = { readonly denominator: number; readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    partySeats: { type: "integer", minimum: 0 },
    occupiedSeats: { type: "integer", minimum: 1 },
    vacantSeats: { type: "integer", minimum: 0 },
    includeVacancies: { type: "boolean" },
  },
  required: ["partySeats", "occupiedSeats", "vacantSeats", "includeVacancies"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { denominator: { type: "integer" }, share: { type: "number" } },
  required: ["denominator", "share"],
} as const;
/** Calculate bicameral seat share one chamber from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { partySeats, occupiedSeats, vacantSeats, includeVacancies } = request;
  const compute = (): Output => {
    H.integer(occupiedSeats, 1);
    H.integer(partySeats, 0, occupiedSeats);
    H.integer(vacantSeats, 0);
    return {
      denominator: occupiedSeats + (includeVacancies ? vacantSeats : 0),
      share:
        partySeats / (occupiedSeats + (includeVacancies ? vacantSeats : 0)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    partySeats: 40,
    occupiedSeats: 90,
    vacantSeats: 10,
    includeVacancies: true,
  },
  output: { denominator: 100, share: 0.4 },
} satisfies ToolExample<Input, Output>;
export const bicameralSeatShareOneChamberTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "political-science/bicameral-seat-share-one-chamber",
    title: "Bicameral Seat Share One Chamber Tool",
    description:
      "Calculate bicameral seat share one chamber from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        partySeats: { type: "integer", minimum: 0 },
        occupiedSeats: { type: "integer", minimum: 1 },
        vacantSeats: { type: "integer", minimum: 0 },
        includeVacancies: { type: "boolean" },
      },
      required: [
        "partySeats",
        "occupiedSeats",
        "vacantSeats",
        "includeVacancies",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "integer" },
        share: { type: "number" },
      },
      required: ["denominator", "share"],
    },
    ports: {
      inputs: [
        {
          id: "partySeats",
          label: "Party Seats",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "occupiedSeats",
          label: "Occupied Seats",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "vacantSeats",
          label: "Vacant Seats",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "includeVacancies",
          label: "Include Vacancies",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "integer" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = bicameralSeatShareOneChamberTool.execute;
export default bicameralSeatShareOneChamberTool;
