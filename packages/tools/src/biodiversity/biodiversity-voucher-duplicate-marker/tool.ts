import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly voucherId: string;
  readonly duplicateVoucherId: string;
  readonly repositoryId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    voucherId: { type: "string", maxLength: 8192, minLength: 1 },
    duplicateVoucherId: { type: "string", maxLength: 8192, minLength: 1 },
    repositoryId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["voucherId", "duplicateVoucherId", "repositoryId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Link supplied duplicate biodiversity voucher identifiers and repository without inferring specimen identity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { voucherId, duplicateVoucherId, repositoryId } = request;
  const compute = (): Output => {
    H.domain(voucherId.length > 0, "voucherId");
    H.domain(duplicateVoucherId.length > 0, "duplicateVoucherId");
    H.domain(repositoryId.length > 0, "repositoryId");
    return {
      token: JSON.stringify([voucherId, duplicateVoucherId, repositoryId]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { voucherId: "V17", duplicateVoucherId: "V17b", repositoryId: "AR4" },
  output: { token: '["V17","V17b","AR4"]' },
} satisfies ToolExample<Input, Output>;
export const biodiversityVoucherDuplicateMarkerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biodiversity", "biology"],
      keywords: ["biodiversity", "biology"],
    },
    id: "biodiversity/biodiversity-voucher-duplicate-marker",
    title: "Biodiversity Voucher Duplicate Marker",
    description:
      "Link supplied duplicate biodiversity voucher identifiers and repository without inferring specimen identity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        voucherId: { type: "string", maxLength: 8192, minLength: 1 },
        duplicateVoucherId: { type: "string", maxLength: 8192, minLength: 1 },
        repositoryId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["voucherId", "duplicateVoucherId", "repositoryId"],
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
          id: "voucherId",
          label: "Voucher Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "duplicateVoucherId",
          label: "Duplicate Voucher Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "repositoryId",
          label: "Repository Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = biodiversityVoucherDuplicateMarkerTool.execute;
export default biodiversityVoucherDuplicateMarkerTool;
