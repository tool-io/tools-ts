import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly itemCode: string;
  readonly respondentCode: string;
  readonly respondentRole: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    itemCode: { type: "string", maxLength: 8192, minLength: 1 },
    respondentCode: { type: "string", maxLength: 8192, minLength: 1 },
    respondentRole: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["itemCode", "respondentCode", "respondentRole"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record the supplied respondent and role for a functional item without treating proxy and self reports as interchangeable. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { itemCode, respondentCode, respondentRole } = request;
  const compute = (): Output => {
    H.domain(itemCode.length > 0, "itemCode");
    H.domain(respondentCode.length > 0, "respondentCode");
    H.domain(respondentRole.length > 0, "respondentRole");
    return {
      token: JSON.stringify([itemCode, respondentCode, respondentRole]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { itemCode: "Q17", respondentCode: "R2", respondentRole: "caregiver" },
  output: { token: '["Q17","R2","caregiver"]' },
} satisfies ToolExample<Input, Output>;
export const functionalItemProxyrespondentLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["geriatrics", "health and medicine"],
      keywords: ["geriatrics", "health and medicine"],
    },
    id: "geriatrics/functional-item-proxy-respondent-label",
    title: "Functional Item Proxy Respondent Label",
    description:
      "Record the supplied respondent and role for a functional item without treating proxy and self reports as interchangeable.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        itemCode: { type: "string", maxLength: 8192, minLength: 1 },
        respondentCode: { type: "string", maxLength: 8192, minLength: 1 },
        respondentRole: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["itemCode", "respondentCode", "respondentRole"],
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
          id: "itemCode",
          label: "Item Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "respondentCode",
          label: "Respondent Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "respondentRole",
          label: "Respondent Role",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = functionalItemProxyrespondentLabelTool.execute;
export default functionalItemProxyrespondentLabelTool;
