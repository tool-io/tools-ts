import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly itemCode: string;
  readonly plannedBeforeTrip: boolean;
  readonly purchased: boolean;
};
export type Output = { readonly tag: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    itemCode: { type: "string", maxLength: 8192, minLength: 1 },
    plannedBeforeTrip: { type: "boolean" },
    purchased: { type: "boolean" },
  },
  required: ["itemCode", "plannedBeforeTrip", "purchased"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tag: { type: "string", maxLength: 8192 } },
  required: ["tag"],
} as const;
/** Label explicit prior-plan and purchase flags without inferring impulsivity or consumer intent. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { itemCode, plannedBeforeTrip, purchased } = request;
  const compute = (): Output => {
    H.domain(itemCode.length > 0, "itemCode");
    return {
      tag:
        itemCode +
        " [" +
        (purchased
          ? plannedBeforeTrip
            ? "planned purchase"
            : "unplanned purchase"
          : plannedBeforeTrip
            ? "planned not purchased"
            : "not purchased") +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { itemCode: "I17", plannedBeforeTrip: false, purchased: true },
  output: { tag: "I17 [unplanned purchase]" },
} satisfies ToolExample<Input, Output>;
export const shoppingItemPlannedUnplannedTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "consumer-behavior",
        "consumer behavior",
        "business and finance",
      ],
      keywords: ["consumer behavior", "business and finance"],
    },
    id: "consumer-behavior/shopping-item-planned-unplanned-tag",
    title: "Shopping Item Planned Unplanned Tag",
    description:
      "Label explicit prior-plan and purchase flags without inferring impulsivity or consumer intent.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        itemCode: { type: "string", maxLength: 8192, minLength: 1 },
        plannedBeforeTrip: { type: "boolean" },
        purchased: { type: "boolean" },
      },
      required: ["itemCode", "plannedBeforeTrip", "purchased"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { tag: { type: "string", maxLength: 8192 } },
      required: ["tag"],
    },
    ports: {
      inputs: [
        {
          id: "itemCode",
          label: "Item Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "plannedBeforeTrip",
          label: "Planned Before Trip",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "purchased",
          label: "Purchased",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "tag", label: "Tag", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = shoppingItemPlannedUnplannedTagTool.execute;
export default shoppingItemPlannedUnplannedTagTool;
