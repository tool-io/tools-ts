import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly defaultOptionCode: string;
  readonly selectedOptionCode: string;
};
export type Output = { readonly defaultSelected: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    defaultOptionCode: { type: "string", maxLength: 8192, minLength: 1 },
    selectedOptionCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["defaultOptionCode", "selectedOptionCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { defaultSelected: { type: "boolean" } },
  required: ["defaultSelected"],
} as const;
/** Compare explicit default and selected purchase-option codes without inferring the reason for a choice. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { defaultOptionCode, selectedOptionCode } = request;
  const compute = (): Output => {
    H.domain(
      defaultOptionCode.length > 0 && selectedOptionCode.length > 0,
      "defaultOptionCode",
    );
    return { defaultSelected: defaultOptionCode === selectedOptionCode };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { defaultOptionCode: "A", selectedOptionCode: "A" },
  output: { defaultSelected: true },
} satisfies ToolExample<Input, Output>;
export const purchaseChoiceDefaultSelectedFlagTool = H.defineSchemaCalculation<
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
    id: "consumer-behavior/purchase-choice-default-selected-flag",
    title: "Purchase Choice Default Selected Flag",
    description:
      "Compare explicit default and selected purchase-option codes without inferring the reason for a choice.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        defaultOptionCode: { type: "string", maxLength: 8192, minLength: 1 },
        selectedOptionCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["defaultOptionCode", "selectedOptionCode"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { defaultSelected: { type: "boolean" } },
      required: ["defaultSelected"],
    },
    ports: {
      inputs: [
        {
          id: "defaultOptionCode",
          label: "Default Option Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "selectedOptionCode",
          label: "Selected Option Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "defaultSelected",
          label: "Default Selected",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = purchaseChoiceDefaultSelectedFlagTool.execute;
export default purchaseChoiceDefaultSelectedFlagTool;
