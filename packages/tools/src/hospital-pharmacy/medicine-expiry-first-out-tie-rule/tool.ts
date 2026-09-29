import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ids: readonly string[];
  readonly expiryDays: readonly number[];
  readonly receivedDays: readonly number[];
};
export type Output = {
  readonly orderedIds: readonly string[];
  readonly originalIndices: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ids: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    expiryDays: { type: "array", maxItems: 256, items: { type: "integer" } },
    receivedDays: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["ids", "expiryDays", "receivedDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    orderedIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    originalIndices: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["orderedIds", "originalIndices"],
} as const;
/** Sort supplied lots by expiry, receipt and stable input order. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ids, expiryDays, receivedDays } = request;
  const compute = (): Output => {
    H.sameLength(ids, expiryDays);
    H.sameLength(ids, receivedDays);
    H.domain(new Set(ids).size === ids.length);
    const originalIndices = ids
      .map((_, i) => i)
      .sort(
        (a, b) =>
          expiryDays[a] - expiryDays[b] ||
          receivedDays[a] - receivedDays[b] ||
          a - b,
      );
    return { orderedIds: originalIndices.map((i) => ids[i]), originalIndices };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    ids: ["A", "B", "C"],
    expiryDays: [100, 90, 100],
    receivedDays: [10, 20, 5],
  },
  output: { orderedIds: ["B", "C", "A"], originalIndices: [1, 2, 0] },
} satisfies ToolExample<Input, Output>;
export const medicineExpiryFirstOutTieRuleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospital-pharmacy/medicine-expiry-first-out-tie-rule",
    title: "Medicine Expiry First Out Tie Rule Tool",
    description:
      "Sort supplied lots by expiry, receipt and stable input order.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ids: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        expiryDays: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        receivedDays: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["ids", "expiryDays", "receivedDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        orderedIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        originalIndices: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["orderedIds", "originalIndices"],
    },
    ports: {
      inputs: [
        {
          id: "ids",
          label: "Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "expiryDays",
          label: "Expiry Days",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "receivedDays",
          label: "Received Days",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "orderedIds",
          label: "Ordered Ids",
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "originalIndices",
          label: "Original Indices",
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
    },
  },
  calculate,
});
export const run = medicineExpiryFirstOutTieRuleTool.execute;
export default medicineExpiryFirstOutTieRuleTool;
