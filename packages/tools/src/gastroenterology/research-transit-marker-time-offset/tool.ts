import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly markerTime: number;
  readonly referenceTime: number;
  readonly suppliedClockOffset: number;
};
export type Output = { readonly offset: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    markerTime: { type: "number" },
    referenceTime: { type: "number" },
    suppliedClockOffset: { type: "number" },
  },
  required: ["markerTime", "referenceTime", "suppliedClockOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { offset: { type: "number" } },
  required: ["offset"],
} as const;
/** Compare supplied research transit markers without a normal-range classification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { markerTime, referenceTime, suppliedClockOffset } = request;
  const compute = (): Output => {
    return { offset: markerTime - referenceTime - suppliedClockOffset };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { markerTime: 30, referenceTime: 10, suppliedClockOffset: 5 },
  output: { offset: 15 },
} satisfies ToolExample<Input, Output>;
export const researchTransitMarkerTimeOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gastroenterology/research-transit-marker-time-offset",
    title: "Research Transit Marker Time Offset Tool",
    description:
      "Compare supplied research transit markers without a normal-range classification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        markerTime: { type: "number" },
        referenceTime: { type: "number" },
        suppliedClockOffset: { type: "number" },
      },
      required: ["markerTime", "referenceTime", "suppliedClockOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { offset: { type: "number" } },
      required: ["offset"],
    },
    ports: {
      inputs: [
        {
          id: "markerTime",
          label: "Marker Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceTime",
          label: "Reference Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedClockOffset",
          label: "Supplied Clock Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "offset", label: "Offset", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = researchTransitMarkerTimeOffsetTool.execute;
export default researchTransitMarkerTimeOffsetTool;
