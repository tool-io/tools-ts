import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startMarkerSeconds: number;
  readonly endMarkerSeconds: number;
};
export type Output = { readonly durationSeconds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startMarkerSeconds: { type: "number" },
    endMarkerSeconds: { type: "number" },
  },
  required: ["startMarkerSeconds", "endMarkerSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { durationSeconds: { type: "number" } },
  required: ["durationSeconds"],
} as const;
/** Measure an explicit spirometry marker interval without determining forced-expiration validity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startMarkerSeconds, endMarkerSeconds } = request;
  const compute = (): Output => {
    H.domain(endMarkerSeconds >= startMarkerSeconds, "endMarkerSeconds");
    return { durationSeconds: endMarkerSeconds - startMarkerSeconds };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { startMarkerSeconds: 1.2, endMarkerSeconds: 7.2 },
  output: { durationSeconds: 6 },
} satisfies ToolExample<Input, Output>;
export const spirometryStartEndMarkerGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pulmonology", "health and medicine"],
      keywords: ["pulmonology", "health and medicine"],
    },
    id: "pulmonology/spirometry-start-end-marker-gap",
    title: "Spirometry Start End Marker Gap",
    description:
      "Measure an explicit spirometry marker interval without determining forced-expiration validity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startMarkerSeconds: { type: "number" },
        endMarkerSeconds: { type: "number" },
      },
      required: ["startMarkerSeconds", "endMarkerSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { durationSeconds: { type: "number" } },
      required: ["durationSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "startMarkerSeconds",
          label: "Start Marker Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endMarkerSeconds",
          label: "End Marker Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "durationSeconds",
          label: "Duration Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = spirometryStartEndMarkerGapTool.execute;
export default spirometryStartEndMarkerGapTool;
