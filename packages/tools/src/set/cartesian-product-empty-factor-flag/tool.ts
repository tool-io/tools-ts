import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly sizes: readonly number[] };
export type Output = { readonly empty: boolean; readonly size: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sizes: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["sizes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    empty: { type: "boolean" },
    size: { type: "string", maxLength: 8192 },
  },
  required: ["empty", "size"],
} as const;
/** Calculate cartesian product empty factor flag from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sizes } = request;
  const compute = (): Output => {
    H.domain(sizes.every((x) => x >= 0));
    let size = 1n;
    for (const n of sizes) size *= BigInt(n);
    return { empty: size === 0n, size: String(size) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sizes: [3, 0, 4] },
  output: { empty: true, size: "0" },
} satisfies ToolExample<Input, Output>;
export const cartesianProductEmptyFactorFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "set/cartesian-product-empty-factor-flag",
    title: "Cartesian Product Empty Factor Flag Tool",
    description:
      "Calculate cartesian product empty factor flag from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sizes: { type: "array", maxItems: 256, items: { type: "integer" } },
      },
      required: ["sizes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        empty: { type: "boolean" },
        size: { type: "string", maxLength: 8192 },
      },
      required: ["empty", "size"],
    },
    ports: {
      inputs: [
        {
          id: "sizes",
          label: "Sizes",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        { id: "empty", label: "Empty", valueType: { type: "boolean" } },
        { id: "size", label: "Size", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = cartesianProductEmptyFactorFlagTool.execute;
export default cartesianProductEmptyFactorFlagTool;
