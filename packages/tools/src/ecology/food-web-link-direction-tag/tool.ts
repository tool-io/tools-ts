import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstTaxon: string;
  readonly secondTaxon: string;
  readonly firstIsResource: boolean;
};
export type Output = { readonly resource: string; readonly consumer: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstTaxon: { type: "string", maxLength: 8192, minLength: 1 },
    secondTaxon: { type: "string", maxLength: 8192, minLength: 1 },
    firstIsResource: { type: "boolean" },
  },
  required: ["firstTaxon", "secondTaxon", "firstIsResource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resource: { type: "string", maxLength: 8192 },
    consumer: { type: "string", maxLength: 8192 },
  },
  required: ["resource", "consumer"],
} as const;
/** Orient one explicitly identified food-web link from resource to consumer without inferring feeding relationships. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstTaxon, secondTaxon, firstIsResource } = request;
  const compute = (): Output => {
    H.domain(firstTaxon.length > 0 && secondTaxon.length > 0, "firstTaxon");
    return {
      resource: firstIsResource ? firstTaxon : secondTaxon,
      consumer: firstIsResource ? secondTaxon : firstTaxon,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstTaxon: "Plant A",
    secondTaxon: "Insect B",
    firstIsResource: true,
  },
  output: { resource: "Plant A", consumer: "Insect B" },
} satisfies ToolExample<Input, Output>;
export const foodWebLinkDirectionTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["ecology", "biology"],
      keywords: ["ecology", "biology"],
    },
    id: "ecology/food-web-link-direction-tag",
    title: "Food Web Link Direction Tag",
    description:
      "Orient one explicitly identified food-web link from resource to consumer without inferring feeding relationships.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstTaxon: { type: "string", maxLength: 8192, minLength: 1 },
        secondTaxon: { type: "string", maxLength: 8192, minLength: 1 },
        firstIsResource: { type: "boolean" },
      },
      required: ["firstTaxon", "secondTaxon", "firstIsResource"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        resource: { type: "string", maxLength: 8192 },
        consumer: { type: "string", maxLength: 8192 },
      },
      required: ["resource", "consumer"],
    },
    ports: {
      inputs: [
        {
          id: "firstTaxon",
          label: "First Taxon",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondTaxon",
          label: "Second Taxon",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "firstIsResource",
          label: "First Is Resource",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "resource", label: "Resource", valueType: { type: "string" } },
        { id: "consumer", label: "Consumer", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = foodWebLinkDirectionTagTool.execute;
export default foodWebLinkDirectionTagTool;
