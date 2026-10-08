import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly radioTimestamp: number;
  readonly radioMinusReferenceOffset: number;
};
export type Output = { readonly referenceTimestamp: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    radioTimestamp: { type: "number" },
    radioMinusReferenceOffset: { type: "number" },
  },
  required: ["radioTimestamp", "radioMinusReferenceOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { referenceTimestamp: { type: "number" } },
  required: ["referenceTimestamp"],
} as const;
/** Remove an explicitly supplied radio-minus-reference clock offset from a radio-log timestamp in matching units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { radioTimestamp, radioMinusReferenceOffset } = request;
  const compute = (): Output => {
    return { referenceTimestamp: radioTimestamp - radioMinusReferenceOffset };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { radioTimestamp: 120, radioMinusReferenceOffset: 5 },
  output: { referenceTimestamp: 115 },
} satisfies ToolExample<Input, Output>;
export const ambulanceRadioLogClockOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "emergency-medicine/ambulance-radio-log-clock-offset",
    title: "Ambulance Radio Log Clock Offset Tool",
    description:
      "Remove an explicitly supplied radio-minus-reference clock offset from a radio-log timestamp in matching units.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        radioTimestamp: { type: "number" },
        radioMinusReferenceOffset: { type: "number" },
      },
      required: ["radioTimestamp", "radioMinusReferenceOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { referenceTimestamp: { type: "number" } },
      required: ["referenceTimestamp"],
    },
    ports: {
      inputs: [
        {
          id: "radioTimestamp",
          label: "Radio Timestamp",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "radioMinusReferenceOffset",
          label: "Radio Minus Reference Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "referenceTimestamp",
          label: "Reference Timestamp",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = ambulanceRadioLogClockOffsetTool.execute;
export default ambulanceRadioLogClockOffsetTool;
