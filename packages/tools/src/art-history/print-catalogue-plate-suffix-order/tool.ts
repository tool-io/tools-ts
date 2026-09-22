import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly plate: number;
  readonly suffix: string;
  readonly orderedSuffixes: readonly string[];
};
export type Output = { readonly plate: number; readonly suffixIndex: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    plate: { type: "integer", minimum: 0 },
    suffix: { type: "string", maxLength: 8192 },
    orderedSuffixes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["plate", "suffix", "orderedSuffixes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { plate: { type: "integer" }, suffixIndex: { type: "integer" } },
  required: ["plate", "suffixIndex"],
} as const;
/** Order a plate suffix using the caller-defined catalogue convention, preserving the numeric plate component. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { plate, suffix, orderedSuffixes } = request;
  const compute = (): Output => {
    H.integer(plate, 0);
    H.domain(new Set(orderedSuffixes).size === orderedSuffixes.length);
    const suffixIndex = orderedSuffixes.indexOf(suffix);
    H.domain(suffixIndex >= 0, "suffix");
    return { plate, suffixIndex };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { plate: 12, suffix: "b", orderedSuffixes: ["", "a", "b"] },
  output: { plate: 12, suffixIndex: 2 },
} satisfies ToolExample<Input, Output>;
export const printCataloguePlateSuffixOrderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-history/print-catalogue-plate-suffix-order",
    title: "Print Catalogue Plate Suffix Order Tool",
    description:
      "Order a plate suffix using the caller-defined catalogue convention, preserving the numeric plate component.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        plate: { type: "integer", minimum: 0 },
        suffix: { type: "string", maxLength: 8192 },
        orderedSuffixes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["plate", "suffix", "orderedSuffixes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        plate: { type: "integer" },
        suffixIndex: { type: "integer" },
      },
      required: ["plate", "suffixIndex"],
    },
    ports: {
      inputs: [
        {
          id: "plate",
          label: "Plate",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suffix",
          label: "Suffix",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "orderedSuffixes",
          label: "Ordered Suffixes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "plate", label: "Plate", valueType: { type: "integer" } },
        {
          id: "suffixIndex",
          label: "Suffix Index",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = printCataloguePlateSuffixOrderTool.execute;
export default printCataloguePlateSuffixOrderTool;
