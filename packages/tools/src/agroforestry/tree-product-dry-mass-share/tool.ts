import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly productWetMass: number;
  readonly dryMatterFraction: number;
  readonly totalDryMass: number;
};
export type Output = {
  readonly productDryMass: number;
  readonly dryMassShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    productWetMass: { type: "number", minimum: 0 },
    dryMatterFraction: { type: "number", minimum: 0, maximum: 1 },
    totalDryMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["productWetMass", "dryMatterFraction", "totalDryMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    productDryMass: { type: "number" },
    dryMassShare: { type: "number" },
  },
  required: ["productDryMass", "dryMassShare"],
} as const;
/** Apply an explicit dry-matter fraction before normalizing product dry mass to a compatible supplied total dry mass. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { productWetMass, dryMatterFraction, totalDryMass } = request;
  const compute = (): Output => {
    H.domain(productWetMass >= 0, "productWetMass");
    (H.domain(
      dryMatterFraction >= 0 && dryMatterFraction <= 1,
      "dryMatterFraction",
    ),
      dryMatterFraction);
    (H.domain(totalDryMass > 0, "totalDryMass"), totalDryMass);
    H.domain(
      productWetMass * dryMatterFraction <= totalDryMass,
      "productWetMass",
    );
    return {
      productDryMass: productWetMass * dryMatterFraction,
      dryMassShare: (productWetMass * dryMatterFraction) / totalDryMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { productWetMass: 20, dryMatterFraction: 0.5, totalDryMass: 40 },
  output: { productDryMass: 10, dryMassShare: 0.25 },
} satisfies ToolExample<Input, Output>;
export const treeProductDryMassShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agroforestry", "agriculture"],
      keywords: ["agroforestry", "agriculture"],
    },
    id: "agroforestry/tree-product-dry-mass-share",
    title: "Tree Product Dry Mass Share",
    description:
      "Apply an explicit dry-matter fraction before normalizing product dry mass to a compatible supplied total dry mass.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        productWetMass: { type: "number", minimum: 0 },
        dryMatterFraction: { type: "number", minimum: 0, maximum: 1 },
        totalDryMass: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["productWetMass", "dryMatterFraction", "totalDryMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        productDryMass: { type: "number" },
        dryMassShare: { type: "number" },
      },
      required: ["productDryMass", "dryMassShare"],
    },
    ports: {
      inputs: [
        {
          id: "productWetMass",
          label: "Product Wet Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dryMatterFraction",
          label: "Dry Matter Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalDryMass",
          label: "Total Dry Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "productDryMass",
          label: "Product Dry Mass",
          valueType: { type: "number" },
        },
        {
          id: "dryMassShare",
          label: "Dry Mass Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = treeProductDryMassShareTool.execute;
export default treeProductDryMassShareTool;
