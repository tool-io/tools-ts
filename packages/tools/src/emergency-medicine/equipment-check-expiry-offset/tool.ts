import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly checkDay: number;
  readonly expiryDay: number;
  readonly endIncluded: boolean;
};
export type Output = {
  readonly remainingDays: number;
  readonly withinEndRule: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    checkDay: { type: "integer" },
    expiryDay: { type: "integer" },
    endIncluded: { type: "boolean" },
  },
  required: ["checkDay", "expiryDay", "endIncluded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingDays: { type: "integer" },
    withinEndRule: { type: "boolean" },
  },
  required: ["remainingDays", "withinEndRule"],
} as const;
/** Inspect supplied equipment-check expiry metadata without certifying readiness or usability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { checkDay, expiryDay, endIncluded } = request;
  const compute = (): Output => {
    return {
      remainingDays: expiryDay - checkDay,
      withinEndRule: endIncluded ? checkDay <= expiryDay : checkDay < expiryDay,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { checkDay: 100, expiryDay: 100, endIncluded: true },
  output: { remainingDays: 0, withinEndRule: true },
} satisfies ToolExample<Input, Output>;
export const equipmentCheckExpiryOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "emergency-medicine/equipment-check-expiry-offset",
    title: "Equipment Check Expiry Offset Tool",
    description:
      "Inspect supplied equipment-check expiry metadata without certifying readiness or usability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        checkDay: { type: "integer" },
        expiryDay: { type: "integer" },
        endIncluded: { type: "boolean" },
      },
      required: ["checkDay", "expiryDay", "endIncluded"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainingDays: { type: "integer" },
        withinEndRule: { type: "boolean" },
      },
      required: ["remainingDays", "withinEndRule"],
    },
    ports: {
      inputs: [
        {
          id: "checkDay",
          label: "Check Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "expiryDay",
          label: "Expiry Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "endIncluded",
          label: "End Included",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "remainingDays",
          label: "Remaining Days",
          valueType: { type: "integer" },
        },
        {
          id: "withinEndRule",
          label: "Within End Rule",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = equipmentCheckExpiryOffsetTool.execute;
export default equipmentCheckExpiryOffsetTool;
