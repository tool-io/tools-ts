import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly authority: string;
  readonly code: string;
  readonly expectedAuthority: string;
  readonly expectedCode: string;
};
export type Output = { readonly matches: boolean; readonly key: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    authority: { type: "string", maxLength: 8192 },
    code: { type: "string", maxLength: 8192 },
    expectedAuthority: { type: "string", maxLength: 8192 },
    expectedCode: { type: "string", maxLength: 8192 },
  },
  required: ["authority", "code", "expectedAuthority", "expectedCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    matches: { type: "boolean" },
    key: { type: "string", maxLength: 8192 },
  },
  required: ["matches", "key"],
} as const;
/** Compare explicit CRS authority/code strings without projecting coordinates. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { authority, code, expectedAuthority, expectedCode } = request;
  const compute = (): Output => {
    H.domain(authority.length > 0 && code.length > 0);
    return {
      matches: authority === expectedAuthority && code === expectedCode,
      key: JSON.stringify([authority, code]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    authority: "EPSG",
    code: "4326",
    expectedAuthority: "EPSG",
    expectedCode: "4326",
  },
  output: { matches: true, key: '["EPSG","4326"]' },
} satisfies ToolExample<Input, Output>;
export const agriculturalMapCrsAuthorityPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroinformatics/agricultural-map-crs-authority-pair",
    title: "Agricultural Map Crs Authority Pair Tool",
    description:
      "Compare explicit CRS authority/code strings without projecting coordinates.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        authority: { type: "string", maxLength: 8192 },
        code: { type: "string", maxLength: 8192 },
        expectedAuthority: { type: "string", maxLength: 8192 },
        expectedCode: { type: "string", maxLength: 8192 },
      },
      required: ["authority", "code", "expectedAuthority", "expectedCode"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        matches: { type: "boolean" },
        key: { type: "string", maxLength: 8192 },
      },
      required: ["matches", "key"],
    },
    ports: {
      inputs: [
        {
          id: "authority",
          label: "Authority",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "code",
          label: "Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "expectedAuthority",
          label: "Expected Authority",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "expectedCode",
          label: "Expected Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "matches", label: "Matches", valueType: { type: "boolean" } },
        { id: "key", label: "Key", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = agriculturalMapCrsAuthorityPairTool.execute;
export default agriculturalMapCrsAuthorityPairTool;
