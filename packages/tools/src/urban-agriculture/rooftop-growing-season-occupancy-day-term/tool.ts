import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly availableDays: number;
  readonly occupiedDays: number;
  readonly turnoverDays: number;
  readonly overlapDays: number;
};
export type Output = {
  readonly netOccupied: number;
  readonly occupancy: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableDays: { type: "integer", minimum: 1 },
    occupiedDays: { type: "integer", minimum: 0 },
    turnoverDays: { type: "integer", minimum: 0 },
    overlapDays: { type: "integer", minimum: 0 },
  },
  required: ["availableDays", "occupiedDays", "turnoverDays", "overlapDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netOccupied: { type: "integer" },
    occupancy: { type: "number" },
  },
  required: ["netOccupied", "occupancy"],
} as const;
/** Calculate rooftop growing season occupancy day term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { availableDays, occupiedDays, turnoverDays, overlapDays } = request;
  const compute = (): Output => {
    H.integer(availableDays, 1);
    H.integer(occupiedDays, 0);
    H.integer(turnoverDays, 0);
    H.integer(overlapDays, 0, Math.min(occupiedDays, turnoverDays));
    H.domain(occupiedDays + turnoverDays - overlapDays <= availableDays);
    return {
      netOccupied: occupiedDays + turnoverDays - overlapDays,
      occupancy: (occupiedDays + turnoverDays - overlapDays) / availableDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    availableDays: 200,
    occupiedDays: 150,
    turnoverDays: 20,
    overlapDays: 10,
  },
  output: { netOccupied: 160, occupancy: 0.8 },
} satisfies ToolExample<Input, Output>;
export const rooftopGrowingSeasonOccupancyDayTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "urban-agriculture/rooftop-growing-season-occupancy-day-term",
      title: "Rooftop Growing Season Occupancy Day Term Tool",
      description:
        "Calculate rooftop growing season occupancy day term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          availableDays: { type: "integer", minimum: 1 },
          occupiedDays: { type: "integer", minimum: 0 },
          turnoverDays: { type: "integer", minimum: 0 },
          overlapDays: { type: "integer", minimum: 0 },
        },
        required: [
          "availableDays",
          "occupiedDays",
          "turnoverDays",
          "overlapDays",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          netOccupied: { type: "integer" },
          occupancy: { type: "number" },
        },
        required: ["netOccupied", "occupancy"],
      },
      ports: {
        inputs: [
          {
            id: "availableDays",
            label: "Available Days",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "occupiedDays",
            label: "Occupied Days",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "turnoverDays",
            label: "Turnover Days",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "overlapDays",
            label: "Overlap Days",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "netOccupied",
            label: "Net Occupied",
            valueType: { type: "integer" },
          },
          {
            id: "occupancy",
            label: "Occupancy",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = rooftopGrowingSeasonOccupancyDayTermTool.execute;
export default rooftopGrowingSeasonOccupancyDayTermTool;
