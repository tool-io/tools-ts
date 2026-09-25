import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly zoneIds: readonly string[];
  readonly order: readonly number[];
};
export type Output = { readonly readingOrder: readonly string[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    zoneIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    order: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["zoneIds", "order"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    readingOrder: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["readingOrder"],
} as const;
/** Order explicit unique line-zone IDs by supplied unique ordinal ranks; no geometric reading-order inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { zoneIds, order } = request;
  const compute = (): Output => {
    H.domain(
      zoneIds.length === order.length &&
        new Set(zoneIds).size === zoneIds.length &&
        new Set(order).size === order.length,
    );
    return {
      readingOrder: zoneIds
        .map((id, i) => ({ id, rank: order[i] }))
        .sort((a, b) => a.rank - b.rank)
        .map((x) => x.id),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { zoneIds: ["A", "B", "C"], order: [2, 1, 3] },
  output: { readingOrder: ["B", "A", "C"] },
} satisfies ToolExample<Input, Output>;
export const manuscriptLineZoneReadingOrderTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "digital-humanities/manuscript-line-zone-reading-order-term",
    title: "Manuscript Line Zone Reading Order Term Tool",
    description:
      "Order explicit unique line-zone IDs by supplied unique ordinal ranks; no geometric reading-order inference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        zoneIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        order: { type: "array", maxItems: 256, items: { type: "integer" } },
      },
      required: ["zoneIds", "order"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        readingOrder: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["readingOrder"],
    },
    ports: {
      inputs: [
        {
          id: "zoneIds",
          label: "Zone Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "order",
          label: "Order",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "readingOrder",
          label: "Reading Order",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = manuscriptLineZoneReadingOrderTermTool.execute;
export default manuscriptLineZoneReadingOrderTermTool;
