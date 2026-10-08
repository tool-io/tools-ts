import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly editionId: string;
  readonly witnessId: string;
  readonly suppliedOmissionCode: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    editionId: { type: "string", maxLength: 8192, minLength: 1 },
    witnessId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedOmissionCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["editionId", "witnessId", "suppliedOmissionCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an edition-qualified explicit witness omission assertion without aligning or adjudicating text. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { editionId, witnessId, suppliedOmissionCode } = request;
  const compute = (): Output => {
    H.domain(editionId.length > 0, "editionId");
    H.domain(witnessId.length > 0, "witnessId");
    H.domain(suppliedOmissionCode.length > 0, "suppliedOmissionCode");
    return {
      token: JSON.stringify([editionId, witnessId, suppliedOmissionCode]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { editionId: "E17", witnessId: "W4", suppliedOmissionCode: "omitted" },
  output: { token: '["E17","W4","omitted"]' },
} satisfies ToolExample<Input, Output>;
export const editionVariantOmissionWitnessTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "digital-humanities/edition-variant-omission-witness-tag",
    title: "Edition Variant Omission Witness Tag Tool",
    description:
      "Preserve an edition-qualified explicit witness omission assertion without aligning or adjudicating text.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        editionId: { type: "string", maxLength: 8192, minLength: 1 },
        witnessId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedOmissionCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["editionId", "witnessId", "suppliedOmissionCode"],
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
          id: "editionId",
          label: "Edition Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "witnessId",
          label: "Witness Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedOmissionCode",
          label: "Supplied Omission Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = editionVariantOmissionWitnessTagTool.execute;
export default editionVariantOmissionWitnessTagTool;
