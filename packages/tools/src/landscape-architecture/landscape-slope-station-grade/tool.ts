import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startStation: number;
  readonly endStation: number;
  readonly startElevation: number;
  readonly endElevation: number;
};
export type Output = { readonly gradePercent: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startStation: { type: "number" },
    endStation: { type: "number" },
    startElevation: { type: "number" },
    endElevation: { type: "number" },
  },
  required: ["startStation", "endStation", "startElevation", "endElevation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gradePercent: { type: "number" } },
  required: ["gradePercent"],
} as const;
/** Calculate signed longitudinal grade between increasing landscape stations using matching horizontal and vertical units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startStation, endStation, startElevation, endElevation } = request;
  const compute = (): Output => {
    H.domain(endStation > startStation, "endStation");
    return {
      gradePercent:
        (100 * (endElevation - startElevation)) / (endStation - startStation),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    startStation: 0,
    endStation: 20,
    startElevation: 100,
    endElevation: 101,
  },
  output: { gradePercent: 5 },
} satisfies ToolExample<Input, Output>;
export const landscapeSlopeStationGradeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "landscape-architecture/landscape-slope-station-grade",
    title: "Landscape Slope Station Grade Tool",
    description:
      "Calculate signed longitudinal grade between increasing landscape stations using matching horizontal and vertical units.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startStation: { type: "number" },
        endStation: { type: "number" },
        startElevation: { type: "number" },
        endElevation: { type: "number" },
      },
      required: [
        "startStation",
        "endStation",
        "startElevation",
        "endElevation",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gradePercent: { type: "number" } },
      required: ["gradePercent"],
    },
    ports: {
      inputs: [
        {
          id: "startStation",
          label: "Start Station",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endStation",
          label: "End Station",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "startElevation",
          label: "Start Elevation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endElevation",
          label: "End Elevation",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "gradePercent",
          label: "Grade Percent",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = landscapeSlopeStationGradeTool.execute;
export default landscapeSlopeStationGradeTool;
