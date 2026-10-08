import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly itemId: string;
  readonly childResponse: string;
  readonly parentResponse: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    itemId: { type: "string", maxLength: 8192, minLength: 1 },
    childResponse: { type: "string", maxLength: 8192, minLength: 1 },
    parentResponse: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["itemId", "childResponse", "parentResponse"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicitly supplied child and parent item responses as separate sources without adjudicating agreement. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { itemId, childResponse, parentResponse } = request;
  const compute = (): Output => {
    H.domain(itemId.length > 0, "itemId");
    H.domain(childResponse.length > 0, "childResponse");
    H.domain(parentResponse.length > 0, "parentResponse");
    return { token: JSON.stringify([itemId, childResponse, parentResponse]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { itemId: "I17", childResponse: "yes", parentResponse: "no" },
  output: { token: '["I17","yes","no"]' },
} satisfies ToolExample<Input, Output>;
export const childReportParentReportSourcePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-psychology/child-report-parent-report-source-pair",
    title: "Child Report Parent Report Source Pair Tool",
    description:
      "Preserve explicitly supplied child and parent item responses as separate sources without adjudicating agreement.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        itemId: { type: "string", maxLength: 8192, minLength: 1 },
        childResponse: { type: "string", maxLength: 8192, minLength: 1 },
        parentResponse: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["itemId", "childResponse", "parentResponse"],
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
          id: "childResponse",
          label: "Child Response",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "parentResponse",
          label: "Parent Response",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = childReportParentReportSourcePairTool.execute;
export default childReportParentReportSourcePairTool;
