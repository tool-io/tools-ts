import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly symbolSetId: string;
  readonly symbolCode: string;
  readonly version: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    symbolSetId: { type: "string", maxLength: 8192, minLength: 1 },
    symbolCode: { type: "string", maxLength: 8192, minLength: 1 },
    version: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["symbolSetId", "symbolCode", "version"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify a supplied augmentative-communication symbol code by set and version without selecting communication content. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { symbolSetId, symbolCode, version } = request;
  const compute = (): Output => {
    H.domain(symbolSetId.length > 0, "symbolSetId");
    H.domain(symbolCode.length > 0, "symbolCode");
    H.domain(version.length > 0, "version");
    return { token: JSON.stringify([symbolSetId, symbolCode, version]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { symbolSetId: "SET17", symbolCode: "SYM3", version: "v2" },
  output: { token: '["SET17","SYM3","v2"]' },
} satisfies ToolExample<Input, Output>;
export const aacSymbolKeyLabelTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["speech-therapy", "speech therapy", "health and medicine"],
      keywords: ["speech therapy", "health and medicine"],
    },
    id: "speech-therapy/aac-symbol-key-label",
    title: "Aac Symbol Key Label",
    description:
      "Qualify a supplied augmentative-communication symbol code by set and version without selecting communication content.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        symbolSetId: { type: "string", maxLength: 8192, minLength: 1 },
        symbolCode: { type: "string", maxLength: 8192, minLength: 1 },
        version: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["symbolSetId", "symbolCode", "version"],
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
          id: "symbolSetId",
          label: "Symbol Set Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "symbolCode",
          label: "Symbol Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "version",
          label: "Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = aacSymbolKeyLabelTool.execute;
export default aacSymbolKeyLabelTool;
