import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly recordId: string; readonly phaseStatus: string };
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    phaseStatus: {
      type: "string",
      maxLength: 8192,
      enum: ["phased", "unphased", "unknown", "not-applicable"],
    },
  },
  required: ["recordId", "phaseStatus"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label explicitly recorded variant phasing status without inferring phase or clinical implications. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, phaseStatus } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(
      ["phased", "unphased", "unknown", "not-applicable"].includes(phaseStatus),
      "phaseStatus",
    );
    return { label: recordId + " [" + phaseStatus + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordId: "V17", phaseStatus: "phased" },
  output: { label: "V17 [phased]" },
} satisfies ToolExample<Input, Output>;
export const variantPhasingStatusLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pharmacogenomics", "pharmacy"],
      keywords: ["pharmacogenomics", "pharmacy"],
    },
    id: "pharmacogenomics/variant-phasing-status-label",
    title: "Variant Phasing Status Label",
    description:
      "Label explicitly recorded variant phasing status without inferring phase or clinical implications.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        phaseStatus: {
          type: "string",
          maxLength: 8192,
          enum: ["phased", "unphased", "unknown", "not-applicable"],
        },
      },
      required: ["recordId", "phaseStatus"],
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
          id: "phaseStatus",
          label: "Phase Status",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = variantPhasingStatusLabelTool.execute;
export default variantPhasingStatusLabelTool;
