import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly plotVolunteerHours: number;
  readonly totalVolunteerHours: number;
};
export type Output = { readonly fraction: number; readonly remainder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    plotVolunteerHours: { type: "number", minimum: 0 },
    totalVolunteerHours: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["plotVolunteerHours", "totalVolunteerHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" }, remainder: { type: "number" } },
  required: ["fraction", "remainder"],
} as const;
/** Normalize explicit volunteer hours attributed to one plot to compatible total recorded hours. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { plotVolunteerHours, totalVolunteerHours } = request;
  const compute = (): Output => {
    (H.domain(totalVolunteerHours > 0, "totalVolunteerHours"),
      totalVolunteerHours);
    H.domain(
      plotVolunteerHours >= 0 && plotVolunteerHours <= totalVolunteerHours,
      "plotVolunteerHours",
    );
    return {
      fraction: plotVolunteerHours / totalVolunteerHours,
      remainder: totalVolunteerHours - plotVolunteerHours,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { plotVolunteerHours: 30, totalVolunteerHours: 120 },
  output: { fraction: 0.25, remainder: 90 },
} satisfies ToolExample<Input, Output>;
export const gardenPlotVolunteerHourShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["urban-agriculture", "urban agriculture", "agriculture"],
      keywords: ["urban agriculture", "agriculture"],
    },
    id: "urban-agriculture/garden-plot-volunteer-hour-share",
    title: "Garden Plot Volunteer Hour Share",
    description:
      "Normalize explicit volunteer hours attributed to one plot to compatible total recorded hours.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        plotVolunteerHours: { type: "number", minimum: 0 },
        totalVolunteerHours: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["plotVolunteerHours", "totalVolunteerHours"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fraction: { type: "number" },
        remainder: { type: "number" },
      },
      required: ["fraction", "remainder"],
    },
    ports: {
      inputs: [
        {
          id: "plotVolunteerHours",
          label: "Plot Volunteer Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalVolunteerHours",
          label: "Total Volunteer Hours",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        { id: "remainder", label: "Remainder", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = gardenPlotVolunteerHourShareTool.execute;
export default gardenPlotVolunteerHourShareTool;
