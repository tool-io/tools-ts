import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly recordedQualityCode: string;
  readonly source: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedQualityCode: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "recordedQualityCode", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicit oximetry quality code and source without evaluating oxygen saturation or signal validity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, recordedQualityCode, source } = request;
  const compute = (): Output => {
    H.domain(
      recordId.length > 0 &&
        recordedQualityCode.length > 0 &&
        source.length > 0,
      "recordId",
    );
    return {
      label:
        recordId +
        "; quality=" +
        JSON.stringify(recordedQualityCode) +
        " [" +
        source +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "O17",
    recordedQualityCode: "artifact",
    source: "Device A",
  },
  output: { label: 'O17; quality="artifact" [Device A]' },
} satisfies ToolExample<Input, Output>;
export const oximetrySignalQualityLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pulmonology", "health and medicine"],
      keywords: ["pulmonology", "health and medicine"],
    },
    id: "pulmonology/oximetry-signal-quality-label",
    title: "Oximetry Signal Quality Label",
    description:
      "Label an explicit oximetry quality code and source without evaluating oxygen saturation or signal validity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        recordedQualityCode: { type: "string", maxLength: 8192, minLength: 1 },
        source: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordId", "recordedQualityCode", "source"],
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
          id: "recordedQualityCode",
          label: "Recorded Quality Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = oximetrySignalQualityLabelTool.execute;
export default oximetrySignalQualityLabelTool;
