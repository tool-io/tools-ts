import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly itemId: string;
  readonly suppliedByline: string;
  readonly agencyCredit: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    itemId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedByline: { type: "string", maxLength: 8192, minLength: 1 },
    agencyCredit: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["itemId", "suppliedByline", "agencyCredit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit news byline and agency credit without determining authorship. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { itemId, suppliedByline, agencyCredit } = request;
  const compute = (): Output => {
    H.domain(itemId.length > 0, "itemId");
    H.domain(suppliedByline.length > 0, "suppliedByline");
    H.domain(agencyCredit.length > 0, "agencyCredit");
    return { token: JSON.stringify([itemId, suppliedByline, agencyCredit]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    itemId: "I17",
    suppliedByline: "Writer A",
    agencyCredit: "Agency B",
  },
  output: { token: '["I17","Writer A","Agency B"]' },
} satisfies ToolExample<Input, Output>;
export const newsBylineAgencyCreditTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["media-studies", "media studies", "social sciences"],
      keywords: ["media studies", "social sciences"],
    },
    id: "media-studies/news-byline-agency-credit-token",
    title: "News Byline Agency Credit Token",
    description:
      "Preserve an explicit news byline and agency credit without determining authorship.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        itemId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedByline: { type: "string", maxLength: 8192, minLength: 1 },
        agencyCredit: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["itemId", "suppliedByline", "agencyCredit"],
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
          id: "suppliedByline",
          label: "Supplied Byline",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "agencyCredit",
          label: "Agency Credit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = newsBylineAgencyCreditTokenTool.execute;
export default newsBylineAgencyCreditTokenTool;
