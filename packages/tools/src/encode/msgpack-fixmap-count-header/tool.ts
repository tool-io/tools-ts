import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly entries: number };
export type Output = { readonly header: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { entries: { type: "integer", minimum: 0, maximum: 15 } },
  required: ["entries"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { header: { type: "integer" } },
  required: ["header"],
} as const;
/** Construct one MessagePack fixmap header octet; does not serialize its entries. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { entries } = request;
  const compute = (): Output => {
    H.integer(entries, 0, 15);
    return { header: 128 + entries };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { entries: 2 },
  output: { header: 130 },
} satisfies ToolExample<Input, Output>;
export const msgpackFixmapCountHeaderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "encode/msgpack-fixmap-count-header",
    title: "MessagePack Fixmap Count Header Tool",
    description:
      "Construct one MessagePack fixmap header octet; does not serialize its entries.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { entries: { type: "integer", minimum: 0, maximum: 15 } },
      required: ["entries"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { header: { type: "integer" } },
      required: ["header"],
    },
    ports: {
      inputs: [
        {
          id: "entries",
          label: "Entries",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "header", label: "Header", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = msgpackFixmapCountHeaderTool.execute;
export default msgpackFixmapCountHeaderTool;
