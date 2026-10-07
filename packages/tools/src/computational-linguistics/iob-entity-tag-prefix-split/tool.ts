import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly tag: string };
export type Output = { readonly prefix: string; readonly entityType: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tag: { type: "string", maxLength: 8192 } },
  required: ["tag"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    prefix: { type: "string", maxLength: 8192 },
    entityType: { type: "string", maxLength: 8192 },
  },
  required: ["prefix", "entityType"],
} as const;
/** Split an explicit IOB B-/I- entity tag or outside O token without validating sequence transitions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tag } = request;
  const compute = (): Output => {
    return (() => {
      H.domain(
        /^(?:O|[BI]-.+)(?![\s\S])/.test(tag) && !/[\r\n]/.test(tag),
        "tag",
      );
      return {
        prefix: tag === "O" ? "O" : tag[0],
        entityType: tag === "O" ? "" : tag.slice(2),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { tag: "B-PER" },
  output: { prefix: "B", entityType: "PER" },
} satisfies ToolExample<Input, Output>;
export const iobEntityTagPrefixSplitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "computational-linguistics",
        "computational linguistics",
        "information and language sciences",
      ],
      keywords: [
        "computational linguistics",
        "information and language sciences",
      ],
    },
    id: "computational-linguistics/iob-entity-tag-prefix-split",
    title: "IOB Entity Tag Prefix Split",
    description:
      "Split an explicit IOB B-/I- entity tag or outside O token without validating sequence transitions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { tag: { type: "string", maxLength: 8192 } },
      required: ["tag"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        prefix: { type: "string", maxLength: 8192 },
        entityType: { type: "string", maxLength: 8192 },
      },
      required: ["prefix", "entityType"],
    },
    ports: {
      inputs: [
        {
          id: "tag",
          label: "Tag",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "prefix", label: "Prefix", valueType: { type: "string" } },
        {
          id: "entityType",
          label: "Entity Type",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = iobEntityTagPrefixSplitTool.execute;
export default iobEntityTagPrefixSplitTool;
