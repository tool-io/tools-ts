import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly offsetKnown: boolean;
  readonly suppliedOffsetMinutes: number;
};
export type Output = {
  readonly canApplyOffset: boolean;
  readonly appliedOffsetMinutes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    offsetKnown: { type: "boolean" },
    suppliedOffsetMinutes: { type: "number" },
  },
  required: ["offsetKnown", "suppliedOffsetMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    canApplyOffset: { type: "boolean" },
    appliedOffsetMinutes: { type: "number" },
  },
  required: ["canApplyOffset", "appliedOffsetMinutes"],
} as const;
/** Expose an explicit clinical date-time offset-known flag; the numeric zero placeholder when unknown is accompanied by canApplyOffset=false. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { offsetKnown, suppliedOffsetMinutes } = request;
  const compute = (): Output => {
    return {
      canApplyOffset: offsetKnown,
      appliedOffsetMinutes: offsetKnown ? suppliedOffsetMinutes : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { offsetKnown: false, suppliedOffsetMinutes: 60 },
  output: { canApplyOffset: false, appliedOffsetMinutes: 0 },
} satisfies ToolExample<Input, Output>;
export const clinicalDatetimeOffsetKnownFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-informatics/clinical-datetime-offset-known-flag",
    title: "Clinical Datetime Offset Known Flag Tool",
    description:
      "Expose an explicit clinical date-time offset-known flag; the numeric zero placeholder when unknown is accompanied by canApplyOffset=false.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        offsetKnown: { type: "boolean" },
        suppliedOffsetMinutes: { type: "number" },
      },
      required: ["offsetKnown", "suppliedOffsetMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        canApplyOffset: { type: "boolean" },
        appliedOffsetMinutes: { type: "number" },
      },
      required: ["canApplyOffset", "appliedOffsetMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "offsetKnown",
          label: "Offset Known",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "suppliedOffsetMinutes",
          label: "Supplied Offset Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "canApplyOffset",
          label: "Can Apply Offset",
          valueType: { type: "boolean" },
        },
        {
          id: "appliedOffsetMinutes",
          label: "Applied Offset Minutes",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = clinicalDatetimeOffsetKnownFlagTool.execute;
export default clinicalDatetimeOffsetKnownFlagTool;
