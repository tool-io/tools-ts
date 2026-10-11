import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly itemId: string;
  readonly recallWording: string;
  readonly source: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    itemId: { type: "string", maxLength: 8192, minLength: 1 },
    recallWording: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["itemId", "recallWording", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record explicit item-recall wording and source without selecting a recall convention or scoring an instrument. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { itemId, recallWording, source } = request;
  const compute = (): Output => {
    H.domain(itemId.length > 0, "itemId");
    H.domain(recallWording.length > 0, "recallWording");
    H.domain(source.length > 0, "source");
    return { token: JSON.stringify([itemId, recallWording, source]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    itemId: "Q17",
    recallWording: "past 7 days",
    source: "Instrument v2",
  },
  output: { token: '["Q17","past 7 days","Instrument v2"]' },
} satisfies ToolExample<Input, Output>;
export const rheumatologyItemRecallSourceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["rheumatology", "health and medicine"],
      keywords: ["rheumatology", "health and medicine"],
    },
    id: "rheumatology/rheumatology-item-recall-source",
    title: "Rheumatology Item Recall Source",
    description:
      "Record explicit item-recall wording and source without selecting a recall convention or scoring an instrument.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        itemId: { type: "string", maxLength: 8192, minLength: 1 },
        recallWording: { type: "string", maxLength: 8192, minLength: 1 },
        source: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["itemId", "recallWording", "source"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
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
          id: "recallWording",
          label: "Recall Wording",
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
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = rheumatologyItemRecallSourceTool.execute;
export default rheumatologyItemRecallSourceTool;
