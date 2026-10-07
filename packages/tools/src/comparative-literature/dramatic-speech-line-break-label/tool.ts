import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly speechId: string;
  readonly lineId: string;
  readonly breakKind: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    speechId: { type: "string", maxLength: 8192, minLength: 1 },
    lineId: { type: "string", maxLength: 8192, minLength: 1 },
    breakKind: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["speechId", "lineId", "breakKind"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record a supplied dramatic speech line break classification without inferring prosody. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { speechId, lineId, breakKind } = request;
  const compute = (): Output => {
    H.domain(speechId.length > 0, "speechId");
    H.domain(lineId.length > 0, "lineId");
    H.domain(breakKind.length > 0, "breakKind");
    return { token: JSON.stringify([speechId, lineId, breakKind]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { speechId: "SP17", lineId: "L4", breakKind: "verse" },
  output: { token: '["SP17","L4","verse"]' },
} satisfies ToolExample<Input, Output>;
export const dramaticSpeechLineBreakLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "comparative-literature",
        "comparative literature",
        "humanities",
      ],
      keywords: ["comparative literature", "humanities"],
    },
    id: "comparative-literature/dramatic-speech-line-break-label",
    title: "Dramatic Speech Line Break Label",
    description:
      "Record a supplied dramatic speech line break classification without inferring prosody.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        speechId: { type: "string", maxLength: 8192, minLength: 1 },
        lineId: { type: "string", maxLength: 8192, minLength: 1 },
        breakKind: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["speechId", "lineId", "breakKind"],
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
          id: "speechId",
          label: "Speech Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "lineId",
          label: "Line Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "breakKind",
          label: "Break Kind",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = dramaticSpeechLineBreakLabelTool.execute;
export default dramaticSpeechLineBreakLabelTool;
