import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly itemId: string;
  readonly recallDays: number;
  readonly source: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    itemId: { type: "string", maxLength: 8192, minLength: 1 },
    recallDays: { type: "integer", minimum: 0 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["itemId", "recallDays", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicit gynecologic item recall length and source without choosing an instrument convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { itemId, recallDays, source } = request;
  const compute = (): Output => {
    H.domain(itemId.length > 0 && source.length > 0, "itemId");
    (H.domain(
      Number.isSafeInteger(recallDays) &&
        recallDays >= 0 &&
        recallDays <= Number.MAX_SAFE_INTEGER,
      "recallDays",
    ),
      recallDays);
    return {
      label: itemId + "; recall=" + recallDays + " days [" + source + "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { itemId: "Q17", recallDays: 7, source: "Instrument v2" },
  output: { label: "Q17; recall=7 days [Instrument v2]" },
} satisfies ToolExample<Input, Output>;
export const gynecologyItemRecallWindowLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["gynecology", "health and medicine"],
      keywords: ["gynecology", "health and medicine"],
    },
    id: "gynecology/gynecology-item-recall-window-label",
    title: "Gynecology Item Recall Window Label",
    description:
      "Label an explicit gynecologic item recall length and source without choosing an instrument convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        itemId: { type: "string", maxLength: 8192, minLength: 1 },
        recallDays: { type: "integer", minimum: 0 },
        source: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["itemId", "recallDays", "source"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "itemId",
          label: "Item Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recallDays",
          label: "Recall Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = gynecologyItemRecallWindowLabelTool.execute;
export default gynecologyItemRecallWindowLabelTool;
