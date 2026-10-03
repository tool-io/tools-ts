import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly responseId: string;
  readonly captioned: boolean;
  readonly interpreted: boolean;
  readonly proxy: boolean;
  readonly language: string;
};
export type Output = {
  readonly sourceKey: string;
  readonly assistanceCount: number;
  readonly selfResponse: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    responseId: { type: "string", maxLength: 8192 },
    captioned: { type: "boolean" },
    interpreted: { type: "boolean" },
    proxy: { type: "boolean" },
    language: { type: "string", maxLength: 8192 },
  },
  required: ["responseId", "captioned", "interpreted", "proxy", "language"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceKey: { type: "string", maxLength: 8192 },
    assistanceCount: { type: "integer" },
    selfResponse: { type: "boolean" },
  },
  required: ["sourceKey", "assistanceCount", "selfResponse"],
} as const;
/** Retain explicit caption/interpreter/proxy response provenance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { responseId, captioned, interpreted, proxy, language } = request;
  const compute = (): Output => {
    H.domain(responseId.length > 0 && language.length > 0);
    return {
      sourceKey: JSON.stringify([
        responseId,
        language,
        captioned,
        interpreted,
        proxy,
      ]),
      assistanceCount: Number(captioned) + Number(interpreted) + Number(proxy),
      selfResponse: !proxy,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    responseId: "R1",
    captioned: true,
    interpreted: false,
    proxy: false,
    language: "en",
  },
  output: {
    sourceKey: '["R1","en",true,false,false]',
    assistanceCount: 1,
    selfResponse: true,
  },
} satisfies ToolExample<Input, Output>;
export const captionAssistedResponseSourceTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "speech-therapy/caption-assisted-response-source-tag",
    title: "Caption Assisted Response Source Tag Tool",
    description:
      "Retain explicit caption/interpreter/proxy response provenance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        responseId: { type: "string", maxLength: 8192 },
        captioned: { type: "boolean" },
        interpreted: { type: "boolean" },
        proxy: { type: "boolean" },
        language: { type: "string", maxLength: 8192 },
      },
      required: ["responseId", "captioned", "interpreted", "proxy", "language"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceKey: { type: "string", maxLength: 8192 },
        assistanceCount: { type: "integer" },
        selfResponse: { type: "boolean" },
      },
      required: ["sourceKey", "assistanceCount", "selfResponse"],
    },
    ports: {
      inputs: [
        {
          id: "responseId",
          label: "Response Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "captioned",
          label: "Captioned",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "interpreted",
          label: "Interpreted",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "proxy",
          label: "Proxy",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "language",
          label: "Language",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "sourceKey", label: "Source Key", valueType: { type: "string" } },
        {
          id: "assistanceCount",
          label: "Assistance Count",
          valueType: { type: "integer" },
        },
        {
          id: "selfResponse",
          label: "Self Response",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = captionAssistedResponseSourceTagTool.execute;
export default captionAssistedResponseSourceTagTool;
