import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly assistanceWording: string;
  readonly selfPerformed: boolean;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    assistanceWording: { type: "string", maxLength: 8192, minLength: 1 },
    selfPerformed: { type: "boolean" },
  },
  required: ["recordId", "assistanceWording", "selfPerformed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label explicitly reported home-measurement assistance without assessing ability or measurement validity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, assistanceWording, selfPerformed } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0 && assistanceWording.length > 0, "recordId");
    return {
      label:
        recordId +
        "; " +
        (selfPerformed ? "self-performed" : "assisted") +
        "; " +
        assistanceWording,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "M17",
    assistanceWording: "no physical help",
    selfPerformed: true,
  },
  output: { label: "M17; self-performed; no physical help" },
} satisfies ToolExample<Input, Output>;
export const homeMeasurementAssistanceLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["geriatrics", "health and medicine"],
      keywords: ["geriatrics", "health and medicine"],
    },
    id: "geriatrics/home-measurement-assistance-label",
    title: "Home Measurement Assistance Label",
    description:
      "Label explicitly reported home-measurement assistance without assessing ability or measurement validity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        assistanceWording: { type: "string", maxLength: 8192, minLength: 1 },
        selfPerformed: { type: "boolean" },
      },
      required: ["recordId", "assistanceWording", "selfPerformed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "recordId",
          label: "Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "assistanceWording",
          label: "Assistance Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "selfPerformed",
          label: "Self Performed",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = homeMeasurementAssistanceLabelTool.execute;
export default homeMeasurementAssistanceLabelTool;
