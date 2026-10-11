import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly endpointId: string;
  readonly endpointCode: string;
  readonly codeSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    endpointId: { type: "string", maxLength: 8192, minLength: 1 },
    endpointCode: { type: "string", maxLength: 8192, minLength: 1 },
    codeSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["endpointId", "endpointCode", "codeSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit endpoint code by its coding source without selecting an endpoint definition. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { endpointId, endpointCode, codeSource } = request;
  const compute = (): Output => {
    H.domain(endpointId.length > 0, "endpointId");
    H.domain(endpointCode.length > 0, "endpointCode");
    H.domain(codeSource.length > 0, "codeSource");
    return { token: JSON.stringify([endpointId, endpointCode, codeSource]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    endpointId: "E17",
    endpointCode: "RESP2",
    codeSource: "Protocol v2",
  },
  output: { token: '["E17","RESP2","Protocol v2"]' },
} satisfies ToolExample<Input, Output>;
export const pdEndpointCodingSourceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pharmacodynamics", "pharmacy"],
      keywords: ["pharmacodynamics", "pharmacy"],
    },
    id: "pharmacodynamics/pd-endpoint-coding-source",
    title: "PD Endpoint Coding Source",
    description:
      "Qualify an explicit endpoint code by its coding source without selecting an endpoint definition.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        endpointId: { type: "string", maxLength: 8192, minLength: 1 },
        endpointCode: { type: "string", maxLength: 8192, minLength: 1 },
        codeSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["endpointId", "endpointCode", "codeSource"],
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
          id: "endpointId",
          label: "Endpoint Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "endpointCode",
          label: "Endpoint Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "codeSource",
          label: "Code Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = pdEndpointCodingSourceTool.execute;
export default pdEndpointCodingSourceTool;
