import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly header: number };
export type Output = { readonly entries: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { header: { type: "integer", minimum: 128, maximum: 143 } },
  required: ["header"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { entries: { type: "integer" } },
  required: ["entries"],
} as const;
/** Decode only one MessagePack fixmap header octet; its low nibble counts key/value pairs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { header } = request;
  const compute = (): Output => {
    H.integer(header, 128, 143);
    return { entries: header - 128 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { header: 130 },
  output: { entries: 2 },
} satisfies ToolExample<Input, Output>;
export const msgpackFixmapEntryCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "decode/msgpack-fixmap-entry-count",
    title: "MessagePack Fixmap Entry Count Tool",
    description:
      "Decode only one MessagePack fixmap header octet; its low nibble counts key/value pairs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { header: { type: "integer", minimum: 128, maximum: 143 } },
      required: ["header"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { entries: { type: "integer" } },
      required: ["entries"],
    },
    ports: {
      inputs: [
        {
          id: "header",
          label: "Header",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "entries", label: "Entries", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = msgpackFixmapEntryCountTool.execute;
export default msgpackFixmapEntryCountTool;
