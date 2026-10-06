import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly slotId: string;
  readonly suppliedCategoryCode: string;
  readonly sourceVersion: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    slotId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedCategoryCode: { type: "string", maxLength: 8192, minLength: 1 },
    sourceVersion: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["slotId", "suppliedCategoryCode", "sourceVersion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit contextual ad-slot category code by source version without classifying content or profiling people. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { slotId, suppliedCategoryCode, sourceVersion } = request;
  const compute = (): Output => {
    H.domain(slotId.length > 0, "slotId");
    H.domain(suppliedCategoryCode.length > 0, "suppliedCategoryCode");
    H.domain(sourceVersion.length > 0, "sourceVersion");
    return {
      token: JSON.stringify([slotId, suppliedCategoryCode, sourceVersion]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    slotId: "SLOT17",
    suppliedCategoryCode: "CAT2",
    sourceVersion: "v2",
  },
  output: { token: '["SLOT17","CAT2","v2"]' },
} satisfies ToolExample<Input, Output>;
export const contextualAdSlotCategoryCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["advertising", "business and finance"],
      keywords: ["advertising", "business and finance"],
    },
    id: "advertising/contextual-ad-slot-category-code",
    title: "Contextual Ad Slot Category Code",
    description:
      "Qualify an explicit contextual ad-slot category code by source version without classifying content or profiling people.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        slotId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedCategoryCode: { type: "string", maxLength: 8192, minLength: 1 },
        sourceVersion: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["slotId", "suppliedCategoryCode", "sourceVersion"],
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
          id: "slotId",
          label: "Slot Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedCategoryCode",
          label: "Supplied Category Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceVersion",
          label: "Source Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = contextualAdSlotCategoryCodeTool.execute;
export default contextualAdSlotCategoryCodeTool;
