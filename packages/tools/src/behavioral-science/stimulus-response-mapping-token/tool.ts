import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stimulusCode: string;
  readonly responseCode: string;
  readonly mappingVersion: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stimulusCode: { type: "string", maxLength: 8192, minLength: 1 },
    responseCode: { type: "string", maxLength: 8192, minLength: 1 },
    mappingVersion: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["stimulusCode", "responseCode", "mappingVersion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Encode one explicitly supplied stimulus/response assignment and mapping version without predicting behavior. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stimulusCode, responseCode, mappingVersion } = request;
  const compute = (): Output => {
    H.domain(
      stimulusCode.length > 0 &&
        responseCode.length > 0 &&
        mappingVersion.length > 0,
      "stimulusCode",
    );
    return {
      token: JSON.stringify([mappingVersion, stimulusCode, responseCode]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { stimulusCode: "S17", responseCode: "left", mappingVersion: "v2" },
  output: { token: '["v2","S17","left"]' },
} satisfies ToolExample<Input, Output>;
export const stimulusResponseMappingTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["behavioral-science", "behavioral science", "psychology"],
      keywords: ["behavioral science", "psychology"],
    },
    id: "behavioral-science/stimulus-response-mapping-token",
    title: "Stimulus Response Mapping Token",
    description:
      "Encode one explicitly supplied stimulus/response assignment and mapping version without predicting behavior.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stimulusCode: { type: "string", maxLength: 8192, minLength: 1 },
        responseCode: { type: "string", maxLength: 8192, minLength: 1 },
        mappingVersion: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["stimulusCode", "responseCode", "mappingVersion"],
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
          id: "stimulusCode",
          label: "Stimulus Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "responseCode",
          label: "Response Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "mappingVersion",
          label: "Mapping Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = stimulusResponseMappingTokenTool.execute;
export default stimulusResponseMappingTokenTool;
