import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly currentDay: number;
  readonly expiryDay: number;
  readonly expiryIncluded: boolean;
};
export type Output = {
  readonly remainingDays: number;
  readonly inTermUnderEndRule: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    currentDay: { type: "integer" },
    expiryDay: { type: "integer" },
    expiryIncluded: { type: "boolean" },
  },
  required: ["currentDay", "expiryDay", "expiryIncluded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingDays: { type: "integer" },
    inTermUnderEndRule: { type: "boolean" },
  },
  required: ["remainingDays", "inTermUnderEndRule"],
} as const;
/** Compare supplied diplomatic-record end dates under an explicit endpoint convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { currentDay, expiryDay, expiryIncluded } = request;
  const compute = (): Output => {
    return {
      remainingDays: expiryDay - currentDay,
      inTermUnderEndRule: expiryIncluded
        ? currentDay <= expiryDay
        : currentDay < expiryDay,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { currentDay: 100, expiryDay: 100, expiryIncluded: true },
  output: { remainingDays: 0, inTermUnderEndRule: true },
} satisfies ToolExample<Input, Output>;
export const diplomaticTermExpiryOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-relations/diplomatic-term-expiry-offset",
    title: "Diplomatic Term Expiry Offset Tool",
    description:
      "Compare supplied diplomatic-record end dates under an explicit endpoint convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        currentDay: { type: "integer" },
        expiryDay: { type: "integer" },
        expiryIncluded: { type: "boolean" },
      },
      required: ["currentDay", "expiryDay", "expiryIncluded"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainingDays: { type: "integer" },
        inTermUnderEndRule: { type: "boolean" },
      },
      required: ["remainingDays", "inTermUnderEndRule"],
    },
    ports: {
      inputs: [
        {
          id: "currentDay",
          label: "Current Day",
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
          id: "expiryIncluded",
          label: "Expiry Included",
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
          id: "inTermUnderEndRule",
          label: "In Term Under End Rule",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = diplomaticTermExpiryOffsetTool.execute;
export default diplomaticTermExpiryOffsetTool;
