import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly contacted: boolean;
  readonly acknowledged: boolean;
};
export type Output = { readonly awaitingAcknowledgment: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contacted: { type: "boolean" },
    acknowledged: { type: "boolean" },
  },
  required: ["contacted", "acknowledged"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { awaitingAcknowledgment: { type: "boolean" } },
  required: ["awaitingAcknowledgment"],
} as const;
/** Flag a recorded safety-contact attempt awaiting acknowledgement, requiring acknowledgement to imply a contact attempt. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { contacted, acknowledged } = request;
  const compute = (): Output => {
    H.domain(!acknowledged || contacted, "acknowledged");
    return { awaitingAcknowledgment: contacted && !acknowledged };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { contacted: true, acknowledged: false },
  output: { awaitingAcknowledgment: true },
} satisfies ToolExample<Input, Output>;
export const safetyContactAcknowledgmentFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "security-studies/safety-contact-acknowledgment-flag",
    title: "Safety Contact Acknowledgment Flag Tool",
    description:
      "Flag a recorded safety-contact attempt awaiting acknowledgement, requiring acknowledgement to imply a contact attempt.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        contacted: { type: "boolean" },
        acknowledged: { type: "boolean" },
      },
      required: ["contacted", "acknowledged"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { awaitingAcknowledgment: { type: "boolean" } },
      required: ["awaitingAcknowledgment"],
    },
    ports: {
      inputs: [
        {
          id: "contacted",
          label: "Contacted",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "acknowledged",
          label: "Acknowledged",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "awaitingAcknowledgment",
          label: "Awaiting Acknowledgment",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = safetyContactAcknowledgmentFlagTool.execute;
export default safetyContactAcknowledgmentFlagTool;
