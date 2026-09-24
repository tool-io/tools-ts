import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly base: readonly string[];
  readonly variant: readonly string[];
  readonly index: number;
};
export type Output = {
  readonly baseToken: string;
  readonly variantToken: string;
  readonly equal: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    base: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    variant: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    index: { type: "integer", minimum: 0 },
  },
  required: ["base", "variant", "index"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseToken: { type: "string", maxLength: 8192 },
    variantToken: { type: "string", maxLength: 8192 },
    equal: { type: "boolean" },
  },
  required: ["baseToken", "variantToken", "equal"],
} as const;
/** Inspect one already-aligned token position; insertion/deletion alignment must be supplied separately. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { base, variant, index } = request;
  const compute = (): Output => {
    H.sameLength(base, variant);
    H.integer(index, 0, base.length - 1);
    return {
      baseToken: base[index],
      variantToken: variant[index],
      equal: base[index] === variant[index],
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    base: ["the", "red", "rose"],
    variant: ["the", "white", "rose"],
    index: 1,
  },
  output: { baseToken: "red", variantToken: "white", equal: false },
} satisfies ToolExample<Input, Output>;
export const manuscriptVariantSingleTokenAlignmentTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "comparative-literature/manuscript-variant-single-token-alignment",
      title: "Manuscript Variant Single Token Alignment Tool",
      description:
        "Inspect one already-aligned token position; insertion/deletion alignment must be supplied separately.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          base: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          variant: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          index: { type: "integer", minimum: 0 },
        },
        required: ["base", "variant", "index"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          baseToken: { type: "string", maxLength: 8192 },
          variantToken: { type: "string", maxLength: 8192 },
          equal: { type: "boolean" },
        },
        required: ["baseToken", "variantToken", "equal"],
      },
      ports: {
        inputs: [
          {
            id: "base",
            label: "Base",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "variant",
            label: "Variant",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "index",
            label: "Index",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "baseToken",
            label: "Base Token",
            valueType: { type: "string" },
          },
          {
            id: "variantToken",
            label: "Variant Token",
            valueType: { type: "string" },
          },
          { id: "equal", label: "Equal", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = manuscriptVariantSingleTokenAlignmentTool.execute;
export default manuscriptVariantSingleTokenAlignmentTool;
