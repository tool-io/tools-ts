import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleId: string;
  readonly recordedStatus: string;
  readonly source: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedStatus: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sampleId", "recordedStatus", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label a supplied serology status and source without interpreting an assay result. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleId, recordedStatus, source } = request;
  const compute = (): Output => {
    H.domain(
      sampleId.length > 0 && recordedStatus.length > 0 && source.length > 0,
      "sampleId",
    );
    return {
      label:
        sampleId + "; " + JSON.stringify(recordedStatus) + " [" + source + "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampleId: "S17", recordedStatus: "indeterminate", source: "Lab A" },
  output: { label: 'S17; "indeterminate" [Lab A]' },
} satisfies ToolExample<Input, Output>;
export const serologyIndeterminateStatusLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["immunology", "health and medicine"],
      keywords: ["immunology", "health and medicine"],
    },
    id: "immunology/serology-indeterminate-status-label",
    title: "Serology Indeterminate Status Label",
    description:
      "Label a supplied serology status and source without interpreting an assay result.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleId: { type: "string", maxLength: 8192, minLength: 1 },
        recordedStatus: { type: "string", maxLength: 8192, minLength: 1 },
        source: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["sampleId", "recordedStatus", "source"],
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
          id: "sampleId",
          label: "Sample Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedStatus",
          label: "Recorded Status",
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
export const run = serologyIndeterminateStatusLabelTool.execute;
export default serologyIndeterminateStatusLabelTool;
