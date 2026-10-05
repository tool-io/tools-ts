import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly signature: string; readonly separator: string };
export type Output = { readonly levels: readonly string[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signature: { type: "string", maxLength: 8192 },
    separator: { type: "string", maxLength: 8192 },
  },
  required: ["signature", "separator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    levels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["levels"],
} as const;
/** Split an archival signature using an explicit literal hierarchy separator, rejecting empty levels. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { signature, separator } = request;
  const compute = (): Output => {
    H.domain(separator.length > 0, "separator");
    const levels = signature.split(separator);
    H.domain(
      levels.every((v) => v.length > 0),
      "signature",
    );
    return { levels };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { signature: "FondsA/Series2/Item17", separator: "/" },
  output: { levels: ["FondsA", "Series2", "Item17"] },
} satisfies ToolExample<Input, Output>;
export const archivalSignatureLevelSplitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "history/archival-signature-level-split",
    title: "Archival Signature Level Split Tool",
    description:
      "Split an archival signature using an explicit literal hierarchy separator, rejecting empty levels.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signature: { type: "string", maxLength: 8192 },
        separator: { type: "string", maxLength: 8192 },
      },
      required: ["signature", "separator"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        levels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["levels"],
    },
    ports: {
      inputs: [
        {
          id: "signature",
          label: "Signature",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "separator",
          label: "Separator",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "levels",
          label: "Levels",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = archivalSignatureLevelSplitTool.execute;
export default archivalSignatureLevelSplitTool;
