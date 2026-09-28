import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly scheduledMinutes: number;
  readonly wornMinutes: number;
  readonly missingMinutes: number;
  readonly excludeMissing: boolean;
};
export type Output = { readonly denominator: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scheduledMinutes: { type: "integer", minimum: 0 },
    wornMinutes: { type: "integer", minimum: 0 },
    missingMinutes: { type: "integer", minimum: 0 },
    excludeMissing: { type: "boolean" },
  },
  required: [
    "scheduledMinutes",
    "wornMinutes",
    "missingMinutes",
    "excludeMissing",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { denominator: { type: "integer" } },
  required: ["denominator"],
} as const;
/** Calculate wearable worn missing minute denominator from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scheduledMinutes, wornMinutes, missingMinutes, excludeMissing } =
    request;
  const compute = (): Output => {
    H.integer(scheduledMinutes, 0);
    H.integer(wornMinutes, 0, scheduledMinutes);
    H.integer(missingMinutes, 0, wornMinutes);
    return {
      denominator: excludeMissing ? wornMinutes - missingMinutes : wornMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    scheduledMinutes: 1440,
    wornMinutes: 900,
    missingMinutes: 30,
    excludeMissing: true,
  },
  output: { denominator: 870 },
} satisfies ToolExample<Input, Output>;
export const wearableWornMissingMinuteDenominatorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "health/wearable-worn-missing-minute-denominator",
      title: "Wearable Worn Missing Minute Denominator Tool",
      description:
        "Calculate wearable worn missing minute denominator from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          scheduledMinutes: { type: "integer", minimum: 0 },
          wornMinutes: { type: "integer", minimum: 0 },
          missingMinutes: { type: "integer", minimum: 0 },
          excludeMissing: { type: "boolean" },
        },
        required: [
          "scheduledMinutes",
          "wornMinutes",
          "missingMinutes",
          "excludeMissing",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { denominator: { type: "integer" } },
        required: ["denominator"],
      },
      ports: {
        inputs: [
          {
            id: "scheduledMinutes",
            label: "Scheduled Minutes",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "wornMinutes",
            label: "Worn Minutes",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "missingMinutes",
            label: "Missing Minutes",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "excludeMissing",
            label: "Exclude Missing",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "denominator",
            label: "Denominator",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = wearableWornMissingMinuteDenominatorTool.execute;
export default wearableWornMissingMinuteDenominatorTool;
