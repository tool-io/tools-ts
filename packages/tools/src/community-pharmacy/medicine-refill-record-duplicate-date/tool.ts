import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly productIds: readonly string[];
  readonly fillDays: readonly number[];
  readonly cancelled: readonly boolean[];
};
export type Output = {
  readonly duplicateIndices: readonly number[];
  readonly activeCount: number;
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
    fillDays: { type: "array", maxItems: 256, items: { type: "integer" } },
    cancelled: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["productIds", "fillDays", "cancelled"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    duplicateIndices: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    activeCount: { type: "integer" },
  },
  required: ["duplicateIndices", "activeCount"],
} as const;
/** Find repeated active product/day refill records without inferring actual use. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { productIds, fillDays, cancelled } = request;
  const compute = (): Output => {
    H.sameLength(productIds, fillDays);
    H.sameLength(productIds, cancelled);
    const seen = new Set<string>(),
      duplicateIndices: number[] = [];
    let activeCount = 0;
    productIds.forEach((x, i) => {
      if (!cancelled[i]) {
        activeCount++;
        const key = JSON.stringify([x, fillDays[i]]);
        if (seen.has(key)) duplicateIndices.push(i);
        seen.add(key);
      }
    });
    return { duplicateIndices, activeCount };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    productIds: ["A", "A", "B", "A"],
    fillDays: [100, 100, 100, 100],
    cancelled: [false, false, false, true],
  },
  output: { duplicateIndices: [1], activeCount: 3 },
} satisfies ToolExample<Input, Output>;
export const medicineRefillRecordDuplicateDateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "community-pharmacy/medicine-refill-record-duplicate-date",
    title: "Medicine Refill Record Duplicate Date Tool",
    description:
      "Find repeated active product/day refill records without inferring actual use.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        productIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        fillDays: { type: "array", maxItems: 256, items: { type: "integer" } },
        cancelled: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["productIds", "fillDays", "cancelled"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        duplicateIndices: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        activeCount: { type: "integer" },
      },
      required: ["duplicateIndices", "activeCount"],
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
          id: "fillDays",
          label: "Fill Days",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "cancelled",
          label: "Cancelled",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "duplicateIndices",
          label: "Duplicate Indices",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "activeCount",
          label: "Active Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = medicineRefillRecordDuplicateDateTool.execute;
export default medicineRefillRecordDuplicateDateTool;
