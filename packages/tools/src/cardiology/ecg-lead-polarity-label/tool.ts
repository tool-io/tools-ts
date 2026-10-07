import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly leadCode: string;
  readonly positiveElectrode: string;
  readonly negativeElectrode: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leadCode: { type: "string", maxLength: 8192, minLength: 1 },
    positiveElectrode: { type: "string", maxLength: 8192, minLength: 1 },
    negativeElectrode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["leadCode", "positiveElectrode", "negativeElectrode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Record explicitly supplied ECG lead polarity wording without defining a clinical lead system. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { leadCode, positiveElectrode, negativeElectrode } = request;
  const compute = (): Output => {
    H.domain(
      leadCode.length > 0 &&
        positiveElectrode.length > 0 &&
        negativeElectrode.length > 0,
      "leadCode",
    );
    return {
      label: leadCode + "; +=" + positiveElectrode + "; -=" + negativeElectrode,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    leadCode: "LEAD-A",
    positiveElectrode: "Electrode 1",
    negativeElectrode: "Electrode 2",
  },
  output: { label: "LEAD-A; +=Electrode 1; -=Electrode 2" },
} satisfies ToolExample<Input, Output>;
export const ecgLeadPolarityLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["cardiology", "health and medicine"],
      keywords: ["cardiology", "health and medicine"],
    },
    id: "cardiology/ecg-lead-polarity-label",
    title: "ECG Lead Polarity Label",
    description:
      "Record explicitly supplied ECG lead polarity wording without defining a clinical lead system.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leadCode: { type: "string", maxLength: 8192, minLength: 1 },
        positiveElectrode: { type: "string", maxLength: 8192, minLength: 1 },
        negativeElectrode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["leadCode", "positiveElectrode", "negativeElectrode"],
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
          id: "leadCode",
          label: "Lead Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "positiveElectrode",
          label: "Positive Electrode",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "negativeElectrode",
          label: "Negative Electrode",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = ecgLeadPolarityLabelTool.execute;
export default ecgLeadPolarityLabelTool;
