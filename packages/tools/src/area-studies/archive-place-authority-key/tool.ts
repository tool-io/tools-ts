import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly placeAuthority: string;
  readonly placeId: string;
  readonly archiveId: string;
};
export type Output = { readonly key: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    placeAuthority: { type: "string", maxLength: 8192, minLength: 1 },
    placeId: { type: "string", maxLength: 8192, minLength: 1 },
    archiveId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["placeAuthority", "placeId", "archiveId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { key: { type: "string", maxLength: 8192 } },
  required: ["key"],
} as const;
/** Scope a supplied archive place identifier to its explicit place-authority namespace. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { placeAuthority, placeId, archiveId } = request;
  const compute = (): Output => {
    H.domain(
      placeAuthority.length > 0 && placeId.length > 0 && archiveId.length > 0,
      "placeAuthority",
    );
    return { key: JSON.stringify([archiveId, placeAuthority, placeId]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { placeAuthority: "gazetteer-A", placeId: "P17", archiveId: "AR3" },
  output: { key: '["AR3","gazetteer-A","P17"]' },
} satisfies ToolExample<Input, Output>;
export const archivePlaceAuthorityKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["area-studies", "area studies", "humanities"],
      keywords: ["area studies", "humanities"],
    },
    id: "area-studies/archive-place-authority-key",
    title: "Archive Place Authority Key",
    description:
      "Scope a supplied archive place identifier to its explicit place-authority namespace.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        placeAuthority: { type: "string", maxLength: 8192, minLength: 1 },
        placeId: { type: "string", maxLength: 8192, minLength: 1 },
        archiveId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["placeAuthority", "placeId", "archiveId"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { key: { type: "string", maxLength: 8192 } },
      required: ["key"],
    },
    ports: {
      inputs: [
        {
          id: "placeAuthority",
          label: "Place Authority",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "placeId",
          label: "Place Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "archiveId",
          label: "Archive Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "key", label: "Key", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = archivePlaceAuthorityKeyTool.execute;
export default archivePlaceAuthorityKeyTool;
