import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly premiseId: string;
  readonly conclusionId: string;
  readonly supportSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    premiseId: { type: "string", maxLength: 8192, minLength: 1 },
    conclusionId: { type: "string", maxLength: 8192, minLength: 1 },
    supportSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["premiseId", "conclusionId", "supportSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record a directed premise-to-conclusion support assertion and attribution without validating the inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { premiseId, conclusionId, supportSource } = request;
  const compute = (): Output => {
    H.domain(premiseId.length > 0, "premiseId");
    H.domain(conclusionId.length > 0, "conclusionId");
    H.domain(supportSource.length > 0, "supportSource");
    return { token: JSON.stringify([premiseId, conclusionId, supportSource]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { premiseId: "P1", conclusionId: "C1", supportSource: "Argument A" },
  output: { token: '["P1","C1","Argument A"]' },
} satisfies ToolExample<Input, Output>;
export const premiseSupportSingleLinkTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["epistemology", "philosophy"],
      keywords: ["epistemology", "philosophy"],
    },
    id: "epistemology/premise-support-single-link-tag",
    title: "Premise Support Single Link Tag",
    description:
      "Record a directed premise-to-conclusion support assertion and attribution without validating the inference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        premiseId: { type: "string", maxLength: 8192, minLength: 1 },
        conclusionId: { type: "string", maxLength: 8192, minLength: 1 },
        supportSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["premiseId", "conclusionId", "supportSource"],
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
          id: "premiseId",
          label: "Premise Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "conclusionId",
          label: "Conclusion Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "supportSource",
          label: "Support Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = premiseSupportSingleLinkTagTool.execute;
export default premiseSupportSingleLinkTagTool;
