import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly laborCost: number;
  readonly materialCost: number;
  readonly equipmentCost: number;
  readonly suppliedMarkupFraction: number;
};
export type Output = { readonly markup: number; readonly total: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    laborCost: { type: "number", minimum: 0 },
    materialCost: { type: "number", minimum: 0 },
    equipmentCost: { type: "number", minimum: 0 },
    suppliedMarkupFraction: { type: "number", minimum: 0 },
  },
  required: [
    "laborCost",
    "materialCost",
    "equipmentCost",
    "suppliedMarkupFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { markup: { type: "number" }, total: { type: "number" } },
  required: ["markup", "total"],
} as const;
/** Apply an explicit change-order markup fraction to the supplied labor, material and equipment cost sum. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { laborCost, materialCost, equipmentCost, suppliedMarkupFraction } =
    request;
  const compute = (): Output => {
    H.domain(laborCost >= 0, "laborCost");
    H.domain(materialCost >= 0, "materialCost");
    H.domain(equipmentCost >= 0, "equipmentCost");
    H.domain(suppliedMarkupFraction >= 0, "suppliedMarkupFraction");
    return (() => {
      const base = laborCost + materialCost + equipmentCost;
      return {
        markup: base * suppliedMarkupFraction,
        total: base * (1 + suppliedMarkupFraction),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    laborCost: 100,
    materialCost: 200,
    equipmentCost: 50,
    suppliedMarkupFraction: 0.2,
  },
  output: { markup: 70, total: 420 },
} satisfies ToolExample<Input, Output>;
export const constructionChangeOrderMarkupBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "construction-management",
        "construction management",
        "engineering",
      ],
      keywords: ["construction management", "engineering"],
    },
    id: "construction-management/construction-change-order-markup-base",
    title: "Construction Change Order Markup Base",
    description:
      "Apply an explicit change-order markup fraction to the supplied labor, material and equipment cost sum.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        laborCost: { type: "number", minimum: 0 },
        materialCost: { type: "number", minimum: 0 },
        equipmentCost: { type: "number", minimum: 0 },
        suppliedMarkupFraction: { type: "number", minimum: 0 },
      },
      required: [
        "laborCost",
        "materialCost",
        "equipmentCost",
        "suppliedMarkupFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { markup: { type: "number" }, total: { type: "number" } },
      required: ["markup", "total"],
    },
    ports: {
      inputs: [
        {
          id: "laborCost",
          label: "Labor Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "materialCost",
          label: "Material Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "equipmentCost",
          label: "Equipment Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedMarkupFraction",
          label: "Supplied Markup Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "markup", label: "Markup", valueType: { type: "number" } },
        { id: "total", label: "Total", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = constructionChangeOrderMarkupBaseTool.execute;
export default constructionChangeOrderMarkupBaseTool;
