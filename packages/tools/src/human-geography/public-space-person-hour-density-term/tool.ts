import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly visitors: number;
  readonly meanDwellHours: number;
  readonly observationHours: number;
  readonly usableArea: number;
};
export type Output = {
  readonly personHours: number;
  readonly meanOccupancy: number;
  readonly meanDensity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    visitors: { type: "integer", minimum: 0 },
    meanDwellHours: { type: "number", minimum: 0 },
    observationHours: { type: "number", exclusiveMinimum: 0 },
    usableArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["visitors", "meanDwellHours", "observationHours", "usableArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    personHours: { type: "number" },
    meanOccupancy: { type: "number" },
    meanDensity: { type: "number" },
  },
  required: ["personHours", "meanOccupancy", "meanDensity"],
} as const;
/** Visitor-time occupancy accounting with complete within-window dwell times, not a crowd-safety assessment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { visitors, meanDwellHours, observationHours, usableArea } = request;
  const compute = (): Output => {
    H.integer(visitors, 0);
    H.domain(meanDwellHours >= 0 && meanDwellHours <= observationHours);
    H.positive(observationHours);
    H.positive(usableArea);
    return {
      personHours: visitors * meanDwellHours,
      meanOccupancy: (visitors * meanDwellHours) / observationHours,
      meanDensity:
        (visitors * meanDwellHours) / (observationHours * usableArea),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    visitors: 100,
    meanDwellHours: 0.5,
    observationHours: 5,
    usableArea: 200,
  },
  output: { personHours: 50, meanOccupancy: 10, meanDensity: 0.05 },
} satisfies ToolExample<Input, Output>;
export const publicSpacePersonHourDensityTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "human-geography/public-space-person-hour-density-term",
    title: "Public Space Person Hour Density Term Tool",
    description:
      "Visitor-time occupancy accounting with complete within-window dwell times, not a crowd-safety assessment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        visitors: { type: "integer", minimum: 0 },
        meanDwellHours: { type: "number", minimum: 0 },
        observationHours: { type: "number", exclusiveMinimum: 0 },
        usableArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "visitors",
        "meanDwellHours",
        "observationHours",
        "usableArea",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        personHours: { type: "number" },
        meanOccupancy: { type: "number" },
        meanDensity: { type: "number" },
      },
      required: ["personHours", "meanOccupancy", "meanDensity"],
    },
    ports: {
      inputs: [
        {
          id: "visitors",
          label: "Visitors",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "meanDwellHours",
          label: "Mean Dwell Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observationHours",
          label: "Observation Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "usableArea",
          label: "Usable Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "personHours",
          label: "Person Hours",
          valueType: { type: "number" },
        },
        {
          id: "meanOccupancy",
          label: "Mean Occupancy",
          valueType: { type: "number" },
        },
        {
          id: "meanDensity",
          label: "Mean Density",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = publicSpacePersonHourDensityTermTool.execute;
export default publicSpacePersonHourDensityTermTool;
