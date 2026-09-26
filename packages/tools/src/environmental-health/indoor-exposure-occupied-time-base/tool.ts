import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly integratedConcentrationTime: number;
  readonly occupiedTime: number;
  readonly totalTime: number;
  readonly useOccupied: boolean;
};
export type Output = {
  readonly timeAverage: number;
  readonly occupancyFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    integratedConcentrationTime: { type: "number" },
    occupiedTime: { type: "number", exclusiveMinimum: 0 },
    totalTime: { type: "number", exclusiveMinimum: 0 },
    useOccupied: { type: "boolean" },
  },
  required: [
    "integratedConcentrationTime",
    "occupiedTime",
    "totalTime",
    "useOccupied",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    timeAverage: { type: "number" },
    occupancyFraction: { type: "number" },
  },
  required: ["timeAverage", "occupancyFraction"],
} as const;
/** Compare a supplied concentration-time integral across explicit time bases, without exposure risk assessment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { integratedConcentrationTime, occupiedTime, totalTime, useOccupied } =
    request;
  const compute = (): Output => {
    H.positive(occupiedTime);
    H.positive(totalTime);
    H.domain(occupiedTime <= totalTime);
    return {
      timeAverage:
        integratedConcentrationTime / (useOccupied ? occupiedTime : totalTime),
      occupancyFraction: occupiedTime / totalTime,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    integratedConcentrationTime: 100,
    occupiedTime: 5,
    totalTime: 10,
    useOccupied: true,
  },
  output: { timeAverage: 20, occupancyFraction: 0.5 },
} satisfies ToolExample<Input, Output>;
export const indoorExposureOccupiedTimeBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-health/indoor-exposure-occupied-time-base",
    title: "Indoor Exposure Occupied Time Base Tool",
    description:
      "Compare a supplied concentration-time integral across explicit time bases, without exposure risk assessment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        integratedConcentrationTime: { type: "number" },
        occupiedTime: { type: "number", exclusiveMinimum: 0 },
        totalTime: { type: "number", exclusiveMinimum: 0 },
        useOccupied: { type: "boolean" },
      },
      required: [
        "integratedConcentrationTime",
        "occupiedTime",
        "totalTime",
        "useOccupied",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        timeAverage: { type: "number" },
        occupancyFraction: { type: "number" },
      },
      required: ["timeAverage", "occupancyFraction"],
    },
    ports: {
      inputs: [
        {
          id: "integratedConcentrationTime",
          label: "Integrated Concentration Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "occupiedTime",
          label: "Occupied Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalTime",
          label: "Total Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "useOccupied",
          label: "Use Occupied",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "timeAverage",
          label: "Time Average",
          valueType: { type: "number" },
        },
        {
          id: "occupancyFraction",
          label: "Occupancy Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = indoorExposureOccupiedTimeBaseTool.execute;
export default indoorExposureOccupiedTimeBaseTool;
