import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly objectId: string;
  readonly suppliedSymbol: string;
  readonly meaningSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    objectId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedSymbol: { type: "string", maxLength: 8192, minLength: 1 },
    meaningSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["objectId", "suppliedSymbol", "meaningSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve a supplied artwork-condition symbol and legend source without assigning condition severity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { objectId, suppliedSymbol, meaningSource } = request;
  const compute = (): Output => {
    H.domain(objectId.length > 0, "objectId");
    H.domain(suppliedSymbol.length > 0, "suppliedSymbol");
    H.domain(meaningSource.length > 0, "meaningSource");
    return { token: JSON.stringify([objectId, suppliedSymbol, meaningSource]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { objectId: "O17", suppliedSymbol: "△", meaningSource: "legend L4" },
  output: { token: '["O17","△","legend L4"]' },
} satisfies ToolExample<Input, Output>;
export const artworkConditionSymbolKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["art-conservation", "art conservation", "arts and design"],
      keywords: ["art conservation", "arts and design"],
    },
    id: "art-conservation/artwork-condition-symbol-key",
    title: "Artwork Condition Symbol Key",
    description:
      "Preserve a supplied artwork-condition symbol and legend source without assigning condition severity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        objectId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedSymbol: { type: "string", maxLength: 8192, minLength: 1 },
        meaningSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["objectId", "suppliedSymbol", "meaningSource"],
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
          id: "objectId",
          label: "Object Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedSymbol",
          label: "Supplied Symbol",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "meaningSource",
          label: "Meaning Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = artworkConditionSymbolKeyTool.execute;
export default artworkConditionSymbolKeyTool;
