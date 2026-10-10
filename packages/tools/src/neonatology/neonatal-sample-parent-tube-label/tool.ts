import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleId: string;
  readonly parentTubeId: string;
  readonly aliquotCode: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleId: { type: "string", maxLength: 8192, minLength: 1 },
    parentTubeId: { type: "string", maxLength: 8192, minLength: 1 },
    aliquotCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sampleId", "parentTubeId", "aliquotCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Associate explicit neonatal sample and parent-tube identifiers without validating specimen lineage. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleId, parentTubeId, aliquotCode } = request;
  const compute = (): Output => {
    H.domain(sampleId.length > 0, "sampleId");
    H.domain(parentTubeId.length > 0, "parentTubeId");
    H.domain(aliquotCode.length > 0, "aliquotCode");
    return { token: JSON.stringify([sampleId, parentTubeId, aliquotCode]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampleId: "S17", parentTubeId: "TUBE3", aliquotCode: "A2" },
  output: { token: '["S17","TUBE3","A2"]' },
} satisfies ToolExample<Input, Output>;
export const neonatalSampleParentTubeLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["neonatology", "health and medicine"],
      keywords: ["neonatology", "health and medicine"],
    },
    id: "neonatology/neonatal-sample-parent-tube-label",
    title: "Neonatal Sample Parent Tube Label",
    description:
      "Associate explicit neonatal sample and parent-tube identifiers without validating specimen lineage.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleId: { type: "string", maxLength: 8192, minLength: 1 },
        parentTubeId: { type: "string", maxLength: 8192, minLength: 1 },
        aliquotCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["sampleId", "parentTubeId", "aliquotCode"],
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
          id: "sampleId",
          label: "Sample Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "parentTubeId",
          label: "Parent Tube Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "aliquotCode",
          label: "Aliquot Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = neonatalSampleParentTubeLabelTool.execute;
export default neonatalSampleParentTubeLabelTool;
