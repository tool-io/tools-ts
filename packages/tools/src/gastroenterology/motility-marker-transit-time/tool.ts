import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly markerStartHours: number;
  readonly markerEndHours: number;
};
export type Output = { readonly elapsedHours: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    markerStartHours: { type: "number" },
    markerEndHours: { type: "number" },
  },
  required: ["markerStartHours", "markerEndHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { elapsedHours: { type: "number" } },
  required: ["elapsedHours"],
} as const;
/** Subtract explicitly recorded marker times on one elapsed-hour timeline without inferring gastrointestinal transit physiology. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { markerStartHours, markerEndHours } = request;
  const compute = (): Output => {
    H.domain(markerEndHours >= markerStartHours, "markerEndHours");
    return { elapsedHours: markerEndHours - markerStartHours };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { markerStartHours: 10, markerEndHours: 46 },
  output: { elapsedHours: 36 },
} satisfies ToolExample<Input, Output>;
export const motilityMarkerTransitTimeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["gastroenterology", "health and medicine"],
      keywords: ["gastroenterology", "health and medicine"],
    },
    id: "gastroenterology/motility-marker-transit-time",
    title: "Motility Marker Transit Time",
    description:
      "Subtract explicitly recorded marker times on one elapsed-hour timeline without inferring gastrointestinal transit physiology.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        markerStartHours: { type: "number" },
        markerEndHours: { type: "number" },
      },
      required: ["markerStartHours", "markerEndHours"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { elapsedHours: { type: "number" } },
      required: ["elapsedHours"],
    },
    ports: {
      inputs: [
        {
          id: "markerStartHours",
          label: "Marker Start Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "markerEndHours",
          label: "Marker End Hours",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "elapsedHours",
          label: "Elapsed Hours",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = motilityMarkerTransitTimeTool.execute;
export default motilityMarkerTransitTimeTool;
