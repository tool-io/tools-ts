import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly productIds: readonly string[];
  readonly serials: readonly string[];
  readonly lots: readonly string[];
};
export type Output = {
  readonly keys: readonly string[];
  readonly duplicateIndices: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    productIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    serials: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    lots: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["productIds", "serials", "lots"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    keys: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    duplicateIndices: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["keys", "duplicateIndices"],
} as const;
/** Find repeated complete product/lot/serial keys without numeric coercion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { productIds, serials, lots } = request;
  const compute = (): Output => {
    H.sameLength(productIds, serials);
    H.sameLength(productIds, lots);
    const keys = productIds.map((x, i) =>
        JSON.stringify([x, lots[i], serials[i]]),
      ),
      seen = new Set<string>(),
      duplicateIndices: number[] = [];
    keys.forEach((x, i) => {
      if (seen.has(x)) duplicateIndices.push(i);
      seen.add(x);
    });
    return { keys, duplicateIndices };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    productIds: ["P", "P", "P"],
    serials: ["001", "002", "001"],
    lots: ["L", "L", "L"],
  },
  output: {
    keys: ['["P","L","001"]', '["P","L","002"]', '["P","L","001"]'],
    duplicateIndices: [2],
  },
} satisfies ToolExample<Input, Output>;
export const medicineReconciliationDuplicatePackageKeyTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "clinical-pharmacy/medicine-reconciliation-duplicate-package-key",
      title: "Medicine Reconciliation Duplicate Package Key Tool",
      description:
        "Find repeated complete product/lot/serial keys without numeric coercion.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          productIds: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          serials: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          lots: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["productIds", "serials", "lots"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          keys: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          duplicateIndices: {
            type: "array",
            maxItems: 256,
            items: { type: "integer" },
          },
        },
        required: ["keys", "duplicateIndices"],
      },
      ports: {
        inputs: [
          {
            id: "productIds",
            label: "Product Ids",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "serials",
            label: "Serials",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "lots",
            label: "Lots",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
        outputs: [
          {
            id: "keys",
            label: "Keys",
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "duplicateIndices",
            label: "Duplicate Indices",
            valueType: { type: "list", items: { type: "integer" } },
          },
        ],
      },
    },
    calculate,
  });
export const run = medicineReconciliationDuplicatePackageKeyTool.execute;
export default medicineReconciliationDuplicatePackageKeyTool;
