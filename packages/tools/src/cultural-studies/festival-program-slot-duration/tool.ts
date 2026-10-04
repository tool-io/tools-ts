import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startMinute: number;
  readonly endMinute: number;
};
export type Output = { readonly durationMinutes: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startMinute: { type: "integer", minimum: 0 },
    endMinute: { type: "integer" },
  },
  required: ["startMinute", "endMinute"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { durationMinutes: { type: "integer" } },
  required: ["durationMinutes"],
} as const;
/** Measure a festival program slot from half-open minute offsets on an explicitly shared program timeline. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startMinute, endMinute } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(startMinute) &&
        startMinute >= 0 &&
        startMinute <= Number.MAX_SAFE_INTEGER,
      "startMinute",
    ),
      startMinute);
    (H.domain(
      Number.isSafeInteger(endMinute) &&
        endMinute >= startMinute &&
        endMinute <= Number.MAX_SAFE_INTEGER,
      "endMinute",
    ),
      endMinute);
    return { durationMinutes: endMinute - startMinute };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { startMinute: 90, endMinute: 135 },
  output: { durationMinutes: 45 },
} satisfies ToolExample<Input, Output>;
export const festivalProgramSlotDurationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cultural-studies/festival-program-slot-duration",
    title: "Festival Program Slot Duration Tool",
    description:
      "Measure a festival program slot from half-open minute offsets on an explicitly shared program timeline.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startMinute: { type: "integer", minimum: 0 },
        endMinute: { type: "integer" },
      },
      required: ["startMinute", "endMinute"],
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
          id: "startMinute",
          label: "Start Minute",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "endMinute",
          label: "End Minute",
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
export const run = festivalProgramSlotDurationTool.execute;
export default festivalProgramSlotDurationTool;
