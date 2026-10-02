import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly voucherId: string;
  readonly author: string;
  readonly source: string;
};
export type Output = {
  readonly hasAuthor: boolean;
  readonly hasSource: boolean;
  readonly citationKey: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    voucherId: { type: "string", maxLength: 8192 },
    author: { type: "string", maxLength: 8192 },
    source: { type: "string", maxLength: 8192 },
  },
  required: ["voucherId", "author", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hasAuthor: { type: "boolean" },
    hasSource: { type: "boolean" },
    citationKey: { type: "string", maxLength: 8192 },
  },
  required: ["hasAuthor", "hasSource", "citationKey"],
} as const;
/** Preserve supplied voucher, authorship and source identifiers without authenticating a specimen. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { voucherId, author, source } = request;
  const compute = (): Output => {
    return {
      hasAuthor: author.trim().length > 0,
      hasSource: source.trim().length > 0,
      citationKey: JSON.stringify([source, voucherId, author]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { voucherId: "V-42", author: "A. Reader", source: "herbarium-A" },
  output: {
    hasAuthor: true,
    hasSource: true,
    citationKey: '["herbarium-A","V-42","A. Reader"]',
  },
} satisfies ToolExample<Input, Output>;
export const botanicalVoucherAuthorshipTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacognosy/botanical-voucher-authorship-token",
    title: "Botanical Voucher Authorship Token Tool",
    description:
      "Preserve supplied voucher, authorship and source identifiers without authenticating a specimen.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        voucherId: { type: "string", maxLength: 8192 },
        author: { type: "string", maxLength: 8192 },
        source: { type: "string", maxLength: 8192 },
      },
      required: ["voucherId", "author", "source"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        hasAuthor: { type: "boolean" },
        hasSource: { type: "boolean" },
        citationKey: { type: "string", maxLength: 8192 },
      },
      required: ["hasAuthor", "hasSource", "citationKey"],
    },
    ports: {
      inputs: [
        {
          id: "voucherId",
          label: "Voucher Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "author",
          label: "Author",
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
      outputs: [
        {
          id: "hasAuthor",
          label: "Has Author",
          valueType: { type: "boolean" },
        },
        {
          id: "hasSource",
          label: "Has Source",
          valueType: { type: "boolean" },
        },
        {
          id: "citationKey",
          label: "Citation Key",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = botanicalVoucherAuthorshipTokenTool.execute;
export default botanicalVoucherAuthorshipTokenTool;
