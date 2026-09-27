import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly category: string;
  readonly suppliedOrder: readonly string[];
};
export type Output = {
  readonly listed: boolean;
  readonly displayIndex: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    category: { type: "string", maxLength: 8192 },
    suppliedOrder: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["category", "suppliedOrder"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    listed: { type: "boolean" },
    displayIndex: { type: "integer" },
  },
  required: ["listed", "displayIndex"],
} as const;
/** Locate a self-reported token in an explicit display order without inferring identity or ranking categories. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { category, suppliedOrder } = request;
  const compute = (): Output => {
    H.domain(new Set(suppliedOrder).size === suppliedOrder.length);
    return {
      listed: suppliedOrder.includes(category),
      displayIndex: suppliedOrder.indexOf(category),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    category: "self-described",
    suppliedOrder: ["declined", "self-described"],
  },
  output: { listed: true, displayIndex: 1 },
} satisfies ToolExample<Input, Output>;
export const selfReportCategoryDisplayIndexTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gender-studies/self-report-category-display-index",
    title: "Self Report Category Display Index Tool",
    description:
      "Locate a self-reported token in an explicit display order without inferring identity or ranking categories.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        category: { type: "string", maxLength: 8192 },
        suppliedOrder: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["category", "suppliedOrder"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        listed: { type: "boolean" },
        displayIndex: { type: "integer" },
      },
      required: ["listed", "displayIndex"],
    },
    ports: {
      inputs: [
        {
          id: "category",
          label: "Category",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedOrder",
          label: "Supplied Order",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "listed", label: "Listed", valueType: { type: "boolean" } },
        {
          id: "displayIndex",
          label: "Display Index",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = selfReportCategoryDisplayIndexTool.execute;
export default selfReportCategoryDisplayIndexTool;
