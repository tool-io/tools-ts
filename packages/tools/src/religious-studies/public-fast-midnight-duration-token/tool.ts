import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startMinutes: number;
  readonly endMinutes: number;
  readonly midnightCrossings: number;
};
export type Output = { readonly durationMinutes: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startMinutes: { type: "integer", minimum: 0, maximum: 1439 },
    endMinutes: { type: "integer", minimum: 0, maximum: 1439 },
    midnightCrossings: { type: "integer", minimum: 0 },
  },
  required: ["startMinutes", "endMinutes", "midnightCrossings"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { durationMinutes: { type: "integer" } },
  required: ["durationMinutes"],
} as const;
/** Elapsed minutes from supplied clock values and explicit day crossings; no religious observance schedule is determined. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startMinutes, endMinutes, midnightCrossings } = request;
  const compute = (): Output => {
    H.integer(startMinutes, 0, 1439);
    H.integer(endMinutes, 0, 1439);
    H.integer(midnightCrossings, 0);
    H.domain(endMinutes - startMinutes + 1440 * midnightCrossings >= 0);
    return {
      durationMinutes: endMinutes - startMinutes + 1440 * midnightCrossings,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { startMinutes: 1080, endMinutes: 360, midnightCrossings: 1 },
  output: { durationMinutes: 720 },
} satisfies ToolExample<Input, Output>;
export const publicFastMidnightDurationTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "religious-studies/public-fast-midnight-duration-token",
    title: "Public Fast Midnight Duration Token Tool",
    description:
      "Elapsed minutes from supplied clock values and explicit day crossings; no religious observance schedule is determined.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startMinutes: { type: "integer", minimum: 0, maximum: 1439 },
        endMinutes: { type: "integer", minimum: 0, maximum: 1439 },
        midnightCrossings: { type: "integer", minimum: 0 },
      },
      required: ["startMinutes", "endMinutes", "midnightCrossings"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { durationMinutes: { type: "integer" } },
      required: ["durationMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "startMinutes",
          label: "Start Minutes",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "endMinutes",
          label: "End Minutes",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "midnightCrossings",
          label: "Midnight Crossings",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "durationMinutes",
          label: "Duration Minutes",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = publicFastMidnightDurationTokenTool.execute;
export default publicFastMidnightDurationTokenTool;
