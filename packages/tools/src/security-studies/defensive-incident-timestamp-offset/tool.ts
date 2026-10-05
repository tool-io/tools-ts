import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedTimestampSeconds: number;
  readonly clockOffsetSeconds: number;
};
export type Output = { readonly correctedTimestampSeconds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedTimestampSeconds: { type: "number" },
    clockOffsetSeconds: { type: "number" },
  },
  required: ["recordedTimestampSeconds", "clockOffsetSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { correctedTimestampSeconds: { type: "number" } },
  required: ["correctedTimestampSeconds"],
} as const;
/** Correct a defensive incident timestamp by subtracting a supplied recorded-clock-minus-reference offset. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedTimestampSeconds, clockOffsetSeconds } = request;
  const compute = (): Output => {
    return {
      correctedTimestampSeconds: recordedTimestampSeconds - clockOffsetSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedTimestampSeconds: 1000, clockOffsetSeconds: 5 },
  output: { correctedTimestampSeconds: 995 },
} satisfies ToolExample<Input, Output>;
export const defensiveIncidentTimestampOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "security-studies/defensive-incident-timestamp-offset",
    title: "Defensive Incident Timestamp Offset Tool",
    description:
      "Correct a defensive incident timestamp by subtracting a supplied recorded-clock-minus-reference offset.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedTimestampSeconds: { type: "number" },
        clockOffsetSeconds: { type: "number" },
      },
      required: ["recordedTimestampSeconds", "clockOffsetSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { correctedTimestampSeconds: { type: "number" } },
      required: ["correctedTimestampSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "recordedTimestampSeconds",
          label: "Recorded Timestamp Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "clockOffsetSeconds",
          label: "Clock Offset Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "correctedTimestampSeconds",
          label: "Corrected Timestamp Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = defensiveIncidentTimestampOffsetTool.execute;
export default defensiveIncidentTimestampOffsetTool;
