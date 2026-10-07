import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly prescriptionId: string;
  readonly suppliedDoseText: string;
};
export type Output = { readonly labelRecord: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    prescriptionId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedDoseText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["prescriptionId", "suppliedDoseText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { labelRecord: { type: "string", maxLength: 8192 } },
  required: ["labelRecord"],
} as const;
/** Serialize an explicit prescription identifier and exact supplied dose text without parsing, altering, or recommending dosing. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { prescriptionId, suppliedDoseText } = request;
  const compute = (): Output => {
    H.domain(
      prescriptionId.length > 0 && suppliedDoseText.length > 0,
      "prescriptionId",
    );
    return { labelRecord: JSON.stringify([prescriptionId, suppliedDoseText]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    prescriptionId: "RX17",
    suppliedDoseText: "Use as recorded on original order",
  },
  output: { labelRecord: '["RX17","Use as recorded on original order"]' },
} satisfies ToolExample<Input, Output>;
export const dispensingLabelDoseTextPreserverTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["community-pharmacy", "community pharmacy", "pharmacy"],
      keywords: ["community pharmacy", "pharmacy"],
    },
    id: "community-pharmacy/dispensing-label-dose-text-preserver",
    title: "Dispensing Label Dose Text Preserver",
    description:
      "Serialize an explicit prescription identifier and exact supplied dose text without parsing, altering, or recommending dosing.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        prescriptionId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedDoseText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["prescriptionId", "suppliedDoseText"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { labelRecord: { type: "string", maxLength: 8192 } },
      required: ["labelRecord"],
    },
    ports: {
      inputs: [
        {
          id: "prescriptionId",
          label: "Prescription Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedDoseText",
          label: "Supplied Dose Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "labelRecord",
          label: "Label Record",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = dispensingLabelDoseTextPreserverTool.execute;
export default dispensingLabelDoseTextPreserverTool;
