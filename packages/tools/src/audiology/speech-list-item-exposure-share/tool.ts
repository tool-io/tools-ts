import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly itemIds: readonly string[];
  readonly presentedIds: readonly string[];
  readonly validResponseIds: readonly string[];
};
export type Output = {
  readonly uniqueItems: number;
  readonly validPresentedItems: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    itemIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    presentedIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    validResponseIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["itemIds", "presentedIds", "validResponseIds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uniqueItems: { type: "integer" },
    validPresentedItems: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["uniqueItems", "validPresentedItems", "share", "defined"],
} as const;
/** Count supplied research speech-item exposure, without interpreting hearing performance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { itemIds, presentedIds, validResponseIds } = request;
  const compute = (): Output => {
    return (() => {
      const uniqueItems = new Set(itemIds).size,
        validPresentedItems = [...new Set(itemIds)].filter(
          (x) => presentedIds.includes(x) && validResponseIds.includes(x),
        ).length;
      return {
        uniqueItems,
        validPresentedItems,
        share: uniqueItems > 0 ? validPresentedItems / uniqueItems : 0,
        defined: uniqueItems > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    itemIds: ["a", "b", "c"],
    presentedIds: ["a", "b"],
    validResponseIds: ["a"],
  },
  output: {
    uniqueItems: 3,
    validPresentedItems: 1,
    share: 0.3333333333333333,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const speechListItemExposureShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "audiology/speech-list-item-exposure-share",
    title: "Speech List Item Exposure Share Tool",
    description:
      "Count supplied research speech-item exposure, without interpreting hearing performance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        itemIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        presentedIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        validResponseIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["itemIds", "presentedIds", "validResponseIds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        uniqueItems: { type: "integer" },
        validPresentedItems: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["uniqueItems", "validPresentedItems", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "itemIds",
          label: "Item Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "presentedIds",
          label: "Presented Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "validResponseIds",
          label: "Valid Response Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "uniqueItems",
          label: "Unique Items",
          valueType: { type: "integer" },
        },
        {
          id: "validPresentedItems",
          label: "Valid Presented Items",
          valueType: { type: "integer" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = speechListItemExposureShareTool.execute;
export default speechListItemExposureShareTool;
