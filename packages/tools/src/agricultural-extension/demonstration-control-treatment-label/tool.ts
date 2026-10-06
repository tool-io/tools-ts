import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly demonstrationId: string;
  readonly controlLabel: string;
  readonly treatmentLabel: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    demonstrationId: { type: "string", maxLength: 8192, minLength: 1 },
    controlLabel: { type: "string", maxLength: 8192, minLength: 1 },
    treatmentLabel: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["demonstrationId", "controlLabel", "treatmentLabel"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Pair explicit demonstration control and treatment labels without estimating a causal effect. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { demonstrationId, controlLabel, treatmentLabel } = request;
  const compute = (): Output => {
    H.domain(demonstrationId.length > 0, "demonstrationId");
    H.domain(controlLabel.length > 0, "controlLabel");
    H.domain(treatmentLabel.length > 0, "treatmentLabel");
    return {
      token: JSON.stringify([demonstrationId, controlLabel, treatmentLabel]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    demonstrationId: "DEMO17",
    controlLabel: "Plot A",
    treatmentLabel: "Plot B",
  },
  output: { token: '["DEMO17","Plot A","Plot B"]' },
} satisfies ToolExample<Input, Output>;
export const demonstrationControlTreatmentLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "agricultural-extension",
        "agricultural extension",
        "agriculture",
      ],
      keywords: ["agricultural extension", "agriculture"],
    },
    id: "agricultural-extension/demonstration-control-treatment-label",
    title: "Demonstration Control Treatment Label",
    description:
      "Pair explicit demonstration control and treatment labels without estimating a causal effect.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        demonstrationId: { type: "string", maxLength: 8192, minLength: 1 },
        controlLabel: { type: "string", maxLength: 8192, minLength: 1 },
        treatmentLabel: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["demonstrationId", "controlLabel", "treatmentLabel"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "demonstrationId",
          label: "Demonstration Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "controlLabel",
          label: "Control Label",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "treatmentLabel",
          label: "Treatment Label",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = demonstrationControlTreatmentLabelTool.execute;
export default demonstrationControlTreatmentLabelTool;
