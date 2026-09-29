import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly signatureDay: number;
  readonly entryDay: number;
  readonly suppliedExcludedDays: number;
};
export type Output = {
  readonly calendarDelay: number;
  readonly adjustedDelay: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signatureDay: { type: "integer" },
    entryDay: { type: "integer" },
    suppliedExcludedDays: { type: "integer", minimum: 0 },
  },
  required: ["signatureDay", "entryDay", "suppliedExcludedDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    calendarDelay: { type: "integer" },
    adjustedDelay: { type: "integer" },
  },
  required: ["calendarDelay", "adjustedDelay"],
} as const;
/** Signed supplied treaty date arithmetic without determining ratification or entry-into-force rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { signatureDay, entryDay, suppliedExcludedDays } = request;
  const compute = (): Output => {
    H.integer(suppliedExcludedDays, 0);
    return {
      calendarDelay: entryDay - signatureDay,
      adjustedDelay: entryDay - signatureDay - suppliedExcludedDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { signatureDay: 100, entryDay: 160, suppliedExcludedDays: 5 },
  output: { calendarDelay: 60, adjustedDelay: 55 },
} satisfies ToolExample<Input, Output>;
export const treatyEntryDelayDaysTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-relations/treaty-entry-delay-days",
    title: "Treaty Entry Delay Days Tool",
    description:
      "Signed supplied treaty date arithmetic without determining ratification or entry-into-force rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signatureDay: { type: "integer" },
        entryDay: { type: "integer" },
        suppliedExcludedDays: { type: "integer", minimum: 0 },
      },
      required: ["signatureDay", "entryDay", "suppliedExcludedDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        calendarDelay: { type: "integer" },
        adjustedDelay: { type: "integer" },
      },
      required: ["calendarDelay", "adjustedDelay"],
    },
    ports: {
      inputs: [
        {
          id: "signatureDay",
          label: "Signature Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "entryDay",
          label: "Entry Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedExcludedDays",
          label: "Supplied Excluded Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "calendarDelay",
          label: "Calendar Delay",
          valueType: { type: "integer" },
        },
        {
          id: "adjustedDelay",
          label: "Adjusted Delay",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = treatyEntryDelayDaysTool.execute;
export default treatyEntryDelayDaysTool;
