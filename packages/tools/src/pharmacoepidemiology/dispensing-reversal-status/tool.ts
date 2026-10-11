import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dispensingId: string;
  readonly recordedReversal: boolean;
  readonly superseded: boolean;
};
export type Output = { readonly countAsActive: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dispensingId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedReversal: { type: "boolean" },
    superseded: { type: "boolean" },
  },
  required: ["dispensingId", "recordedReversal", "superseded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { countAsActive: { type: "boolean" } },
  required: ["countAsActive"],
} as const;
/** Combine explicit reversal and supersession flags for a dispensing record without adjudicating a claim. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dispensingId, recordedReversal, superseded } = request;
  const compute = (): Output => {
    H.domain(dispensingId.length > 0, "dispensingId");
    return { countAsActive: !recordedReversal && !superseded };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dispensingId: "D17", recordedReversal: false, superseded: false },
  output: { countAsActive: true },
} satisfies ToolExample<Input, Output>;
export const dispensingReversalStatusTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pharmacoepidemiology", "pharmacy"],
      keywords: ["pharmacoepidemiology", "pharmacy"],
    },
    id: "pharmacoepidemiology/dispensing-reversal-status",
    title: "Dispensing Reversal Status",
    description:
      "Combine explicit reversal and supersession flags for a dispensing record without adjudicating a claim.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dispensingId: { type: "string", maxLength: 8192, minLength: 1 },
        recordedReversal: { type: "boolean" },
        superseded: { type: "boolean" },
      },
      required: ["dispensingId", "recordedReversal", "superseded"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { countAsActive: { type: "boolean" } },
      required: ["countAsActive"],
    },
    ports: {
      inputs: [
        {
          id: "dispensingId",
          label: "Dispensing Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedReversal",
          label: "Recorded Reversal",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "superseded",
          label: "Superseded",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "countAsActive",
          label: "Count As Active",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = dispensingReversalStatusTool.execute;
export default dispensingReversalStatusTool;
