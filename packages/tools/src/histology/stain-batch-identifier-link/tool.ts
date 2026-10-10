import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly slideId: string;
  readonly stainBatchId: string;
  readonly protocolVersion: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    slideId: { type: "string", maxLength: 8192, minLength: 1 },
    stainBatchId: { type: "string", maxLength: 8192, minLength: 1 },
    protocolVersion: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["slideId", "stainBatchId", "protocolVersion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Associate a slide with an explicit stain batch and protocol version without assessing staining quality. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { slideId, stainBatchId, protocolVersion } = request;
  const compute = (): Output => {
    H.domain(slideId.length > 0, "slideId");
    H.domain(stainBatchId.length > 0, "stainBatchId");
    H.domain(protocolVersion.length > 0, "protocolVersion");
    return { token: JSON.stringify([slideId, stainBatchId, protocolVersion]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { slideId: "SL17", stainBatchId: "BATCH-A", protocolVersion: "v3" },
  output: { token: '["SL17","BATCH-A","v3"]' },
} satisfies ToolExample<Input, Output>;
export const stainBatchIdentifierLinkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["histology", "biology"],
      keywords: ["histology", "biology"],
    },
    id: "histology/stain-batch-identifier-link",
    title: "Stain Batch Identifier Link",
    description:
      "Associate a slide with an explicit stain batch and protocol version without assessing staining quality.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        slideId: { type: "string", maxLength: 8192, minLength: 1 },
        stainBatchId: { type: "string", maxLength: 8192, minLength: 1 },
        protocolVersion: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["slideId", "stainBatchId", "protocolVersion"],
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
          id: "slideId",
          label: "Slide Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "stainBatchId",
          label: "Stain Batch Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "protocolVersion",
          label: "Protocol Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = stainBatchIdentifierLinkTool.execute;
export default stainBatchIdentifierLinkTool;
