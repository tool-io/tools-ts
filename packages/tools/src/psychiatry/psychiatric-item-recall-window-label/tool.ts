import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly itemId: string;
  readonly recallAmount: number;
  readonly recallUnit: string;
  readonly source: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    itemId: { type: "string", maxLength: 8192, minLength: 1 },
    recallAmount: { type: "number", minimum: 0 },
    recallUnit: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["itemId", "recallAmount", "recallUnit", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly supplied psychiatric item recall window without choosing a validated instrument convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { itemId, recallAmount, recallUnit, source } = request;
  const compute = (): Output => {
    H.domain(
      itemId.length > 0 && recallUnit.length > 0 && source.length > 0,
      "itemId",
    );
    H.domain(recallAmount >= 0, "recallAmount");
    return {
      label:
        itemId +
        "; recall=" +
        recallAmount +
        " " +
        recallUnit +
        " [" +
        source +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    itemId: "Q17",
    recallAmount: 7,
    recallUnit: "days",
    source: "Instrument v2",
  },
  output: { label: "Q17; recall=7 days [Instrument v2]" },
} satisfies ToolExample<Input, Output>;
export const psychiatricItemRecallWindowLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["psychiatry", "health and medicine"],
      keywords: ["psychiatry", "health and medicine"],
    },
    id: "psychiatry/psychiatric-item-recall-window-label",
    title: "Psychiatric Item Recall Window Label",
    description:
      "Label an explicitly supplied psychiatric item recall window without choosing a validated instrument convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        itemId: { type: "string", maxLength: 8192, minLength: 1 },
        recallAmount: { type: "number", minimum: 0 },
        recallUnit: { type: "string", maxLength: 8192, minLength: 1 },
        source: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["itemId", "recallAmount", "recallUnit", "source"],
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
          id: "recallAmount",
          label: "Recall Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recallUnit",
          label: "Recall Unit",
          required: true,
          valueType: { type: "string" },
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
export const run = psychiatricItemRecallWindowLabelTool.execute;
export default psychiatricItemRecallWindowLabelTool;
