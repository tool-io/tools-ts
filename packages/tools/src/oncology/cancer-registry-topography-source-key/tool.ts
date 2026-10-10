import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly registryRecordId: string;
  readonly topographyCode: string;
  readonly codingSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    registryRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    topographyCode: { type: "string", maxLength: 8192, minLength: 1 },
    codingSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["registryRecordId", "topographyCode", "codingSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify a supplied cancer-registry topography code by its source without assigning cancer site or validating coding. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { registryRecordId, topographyCode, codingSource } = request;
  const compute = (): Output => {
    H.domain(registryRecordId.length > 0, "registryRecordId");
    H.domain(topographyCode.length > 0, "topographyCode");
    H.domain(codingSource.length > 0, "codingSource");
    return {
      token: JSON.stringify([registryRecordId, topographyCode, codingSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    registryRecordId: "R17",
    topographyCode: "CODE-A",
    codingSource: "Registry manual v2",
  },
  output: { token: '["R17","CODE-A","Registry manual v2"]' },
} satisfies ToolExample<Input, Output>;
export const cancerRegistryTopographySourceKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["oncology", "health and medicine"],
      keywords: ["oncology", "health and medicine"],
    },
    id: "oncology/cancer-registry-topography-source-key",
    title: "Cancer Registry Topography Source Key",
    description:
      "Qualify a supplied cancer-registry topography code by its source without assigning cancer site or validating coding.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        registryRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        topographyCode: { type: "string", maxLength: 8192, minLength: 1 },
        codingSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["registryRecordId", "topographyCode", "codingSource"],
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
          id: "registryRecordId",
          label: "Registry Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "topographyCode",
          label: "Topography Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "codingSource",
          label: "Coding Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = cancerRegistryTopographySourceKeyTool.execute;
export default cancerRegistryTopographySourceKeyTool;
