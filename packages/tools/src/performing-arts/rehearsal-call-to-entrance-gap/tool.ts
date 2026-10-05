import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly callMinute: number;
  readonly entranceMinute: number;
};
export type Output = { readonly preparationMinutes: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    callMinute: { type: "integer", minimum: 0 },
    entranceMinute: { type: "integer" },
  },
  required: ["callMinute", "entranceMinute"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { preparationMinutes: { type: "integer" } },
  required: ["preparationMinutes"],
} as const;
/** Measure preparation time from a rehearsal call to an entrance on a shared timeline. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { callMinute, entranceMinute } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(callMinute) &&
        callMinute >= 0 &&
        callMinute <= Number.MAX_SAFE_INTEGER,
      "callMinute",
    ),
      callMinute);
    (H.domain(
      Number.isSafeInteger(entranceMinute) &&
        entranceMinute >= callMinute &&
        entranceMinute <= Number.MAX_SAFE_INTEGER,
      "entranceMinute",
    ),
      entranceMinute);
    return { preparationMinutes: entranceMinute - callMinute };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { callMinute: 540, entranceMinute: 585 },
  output: { preparationMinutes: 45 },
} satisfies ToolExample<Input, Output>;
export const rehearsalCallToEntranceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "performing-arts/rehearsal-call-to-entrance-gap",
    title: "Rehearsal Call To Entrance Gap Tool",
    description:
      "Measure preparation time from a rehearsal call to an entrance on a shared timeline.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        callMinute: { type: "integer", minimum: 0 },
        entranceMinute: { type: "integer" },
      },
      required: ["callMinute", "entranceMinute"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { preparationMinutes: { type: "integer" } },
      required: ["preparationMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "callMinute",
          label: "Call Minute",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "entranceMinute",
          label: "Entrance Minute",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "preparationMinutes",
          label: "Preparation Minutes",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = rehearsalCallToEntranceGapTool.execute;
export default rehearsalCallToEntranceGapTool;
